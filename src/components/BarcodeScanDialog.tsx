import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { X, Loader2, Barcode, Camera, Minus, Plus, Zap, ZapOff } from "lucide-react";
import { toast } from "sonner";
import { logFood, createDraft } from "@/lib/nutrition.functions";

type Unit = "g" | "ml" | "dl" | "l";

interface Product {
  code: string;
  name: string;
  brand: string | null;
  kcal_per_100g: number;
  protein_g_per_100g: number;
  carbs_g_per_100g: number;
  fat_g_per_100g: number;
  serving_size_g: number | null;
  is_beverage: boolean;
}

interface Props {
  date: string;
  slot: string;
  onClose: () => void;
  onLogged: () => void;
  onDraftSaved?: () => void;
}

// Extended MediaTrackCapabilities/Constraints for focus/zoom/torch (not in default TS lib)
type AdvancedTrackCaps = MediaTrackCapabilities & {
  zoom?: { min: number; max: number; step: number };
  torch?: boolean;
  focusMode?: string[];
};
type AdvancedTrackConstraint = MediaTrackConstraintSet & {
  zoom?: number;
  torch?: boolean;
  focusMode?: string;
};

type OFFProduct = {
  product_name?: string;
  product_name_en?: string;
  product_name_no?: string;
  product_name_nb?: string;
  product_name_pt?: string;
  product_name_es?: string;
  product_name_fr?: string;
  product_name_de?: string;
  product_name_it?: string;
  generic_name?: string;
  abbreviated_product_name?: string;
  brands?: string;
  serving_quantity?: number | string;
  categories_tags?: string[];
  nutriments?: Record<string, number | string>;
};

async function fetchOFF(host: string, code: string): Promise<OFFProduct | null> {
  try {
    const res = await fetch(
      `https://${host}/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,product_name_en,product_name_no,product_name_nb,product_name_pt,product_name_es,product_name_fr,product_name_de,product_name_it,generic_name,abbreviated_product_name,brands,nutriments,serving_quantity,quantity,categories_tags`,
    );
    if (!res.ok) return null;
    const j = (await res.json()) as { status?: number; product?: OFFProduct };
    if (j.status !== 1 || !j.product) return null;
    return j.product;
  } catch {
    return null;
  }
}

async function lookupOFF(code: string): Promise<Product | null> {
  // Query the global aggregator plus every major national mirror in parallel.
  // OFF federates crowdsourced entries per country, so a Norwegian milk carton
  // that isn't yet in `world` is often present in `no`, and vice versa.
  const hosts = [
    "world.openfoodfacts.org",
    "no.openfoodfacts.org",
    "br.openfoodfacts.org",
    "us.openfoodfacts.org",
    "uk.openfoodfacts.org",
    "es.openfoodfacts.org",
    "fr.openfoodfacts.org",
    "de.openfoodfacts.org",
    "it.openfoodfacts.org",
  ];

  const results = await Promise.all(hosts.map((h) => fetchOFF(h, code)));
  let product: OFFProduct | null = results.find((r) => r != null) ?? null;

  // Fallback: try the search endpoint (some entries are only indexed by code
  // there, especially newly-added Nordic grocery items).
  if (!product) {
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v2/search?code=${encodeURIComponent(code)}&fields=product_name,product_name_en,product_name_no,product_name_nb,product_name_pt,product_name_es,product_name_fr,product_name_de,product_name_it,generic_name,abbreviated_product_name,brands,nutriments,serving_quantity,categories_tags&page_size=1`,
      );
      if (res.ok) {
        const j = (await res.json()) as { products?: OFFProduct[] };
        product = j.products?.[0] ?? null;
      }
    } catch {
      /* noop */
    }
  }
  if (!product) return null;

  const n = product.nutriments ?? {};
  const num = (v: unknown) => (typeof v === "number" ? v : v ? Number(v) : 0);
  const kcal =
    num(n["energy-kcal_100g"]) ||
    num(n["energy-kcal"]) ||
    Math.round(num(n["energy_100g"]) / 4.184);
  if (!kcal && !num(n.proteins_100g) && !num(n.carbohydrates_100g) && !num(n.fat_100g)) return null;

  const cats = (product.categories_tags ?? []).join(",");
  const is_beverage =
    /beverage|drink|water|juice|soda|milk|coffee|tea|bebida|boisson|getränk|bevanda/i.test(cats);

  // Pick the best available name across languages
  const name =
    product.product_name?.trim() ||
    product.product_name_en?.trim() ||
    product.product_name_no?.trim() ||
    product.product_name_nb?.trim() ||
    product.product_name_pt?.trim() ||
    product.product_name_es?.trim() ||
    product.product_name_fr?.trim() ||
    product.product_name_de?.trim() ||
    product.product_name_it?.trim() ||
    product.abbreviated_product_name?.trim() ||
    product.generic_name?.trim() ||
    "Unknown product";

  return {
    code,
    name,
    brand: product.brands?.split(",")[0]?.trim() || null,
    kcal_per_100g: kcal,
    protein_g_per_100g: num(n.proteins_100g),
    carbs_g_per_100g: num(n.carbohydrates_100g),
    fat_g_per_100g: num(n.fat_100g),
    serving_size_g: product.serving_quantity ? Number(product.serving_quantity) : null,
    is_beverage,
  };
}

export function BarcodeScanDialog({ date, slot, onClose, onLogged, onDraftSaved }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [amount, setAmount] = useState<string>("100");
  const [unit, setUnit] = useState<Unit>("g");
  const [servings, setServings] = useState(1);
  const amountNum = amount === "" ? 0 : Math.max(0, Number(amount) || 0);

  const [zoom, setZoom] = useState(1);
  const [zoomRange, setZoomRange] = useState<{ min: number; max: number; step: number } | null>(
    null,
  );
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [shape, setShape] = useState<"long" | "square">("long");

  const logFn = useServerFn(logFood);
  const draftFn = useServerFn(createDraft);

  const stopCamera = () => {
    try {
      controlsRef.current?.stop();
    } catch {
      /* noop */
    }
    controlsRef.current = null;
    trackRef.current = null;
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  // Extract a GTIN from raw scan text. 2D codes (GS1 DataMatrix / QR) on food
  // packaging usually start with AI "01" followed by a 14-digit GTIN, sometimes
  // preceded by the FNC1/ ]d2 symbology identifier and followed by more AIs
  // separated by GS (0x1D). We normalize to the plain GTIN so OFF can find it.
  const normalizeCode = (raw: string): string => {
    let s = raw.trim();
    // Strip symbology identifier like "]d2" / "]C1" / "]Q1"
    if (s.startsWith("]") && s.length > 3) s = s.slice(3);
    // GS1 AI 01 → 14-digit GTIN
    const gs1 = s.match(/^01(\d{14})/);
    if (gs1) {
      let gtin = gs1[1];
      // OFF stores EAN-13 without the leading packaging indicator digit
      if (gtin.startsWith("0")) gtin = gtin.slice(1);
      return gtin;
    }
    // Otherwise keep only digits (handles CODE_128 numeric etc.)
    const digits = s.replace(/\D/g, "");
    return digits || s;
  };

  const handleCode = async (raw: string) => {
    const code = normalizeCode(raw);
    stopCamera();
    setScanning(false);
    setLookingUp(true);
    setError(null);
    try {
      const p = await lookupOFF(code);
      if (!p) {
        setError(`No product found for ${code}. Try another item or add manually.`);
      } else {
        setProduct(p);
        const u: Unit = p.is_beverage ? "ml" : "g";
        setUnit(u);
        setAmount(String(p.serving_size_g ?? (p.is_beverage ? 250 : 100)));
        setServings(1);
      }
    } catch {
      setError("Lookup failed. Check your connection.");
    } finally {
      setLookingUp(false);
    }
  };

  const startScanner = async () => {
    try {
      const [{ BrowserMultiFormatReader }, zxingCommon] = await Promise.all([
        import("@zxing/browser"),
        import("@zxing/library"),
      ]);
      const { DecodeHintType, BarcodeFormat } = zxingCommon;

      // Support both 1D product barcodes AND 2D codes (GS1 DataMatrix / QR /
      // PDF417 / Aztec) which are increasingly used on food packaging.
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.ITF,
        BarcodeFormat.DATA_MATRIX,
        BarcodeFormat.QR_CODE,
        BarcodeFormat.PDF_417,
        BarcodeFormat.AZTEC,
      ]);
      hints.set(DecodeHintType.TRY_HARDER, true);

      const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 120 });

      // High-res rear camera with continuous autofocus for sharp close-ups
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          // @ts-expect-error non-standard but widely supported on mobile
          focusMode: "continuous",
          advanced: [{ focusMode: "continuous" } as AdvancedTrackConstraint],
        },
        audio: false,
      });

      const track = stream.getVideoTracks()[0];
      trackRef.current = track;

      // Detect zoom / torch capabilities
      const caps = (track.getCapabilities?.() ?? {}) as AdvancedTrackCaps;
      if (caps.zoom) {
        setZoomRange({ min: caps.zoom.min, max: caps.zoom.max, step: caps.zoom.step || 0.1 });
        setZoom(caps.zoom.min);
      }
      setTorchSupported(Boolean(caps.torch));

      if (!videoRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => undefined);

      const controls = await reader.decodeFromVideoElement(videoRef.current, (result) => {
        if (result) {
          const text = result.getText();
          if (text) void handleCode(text);
        }
      });
      controlsRef.current = controls;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Camera unavailable");
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await startScanner();
    })();
    return () => {
      cancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply zoom changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !zoomRange) return;
    track
      .applyConstraints({ advanced: [{ zoom } as AdvancedTrackConstraint] })
      .catch(() => undefined);
  }, [zoom, zoomRange]);

  const toggleTorch = async () => {
    const track = trackRef.current;
    if (!track || !torchSupported) return;
    const next = !torchOn;
    try {
      await track.applyConstraints({ advanced: [{ torch: next } as AdvancedTrackConstraint] });
      setTorchOn(next);
    } catch {
      toast.error("Torch unavailable");
    }
  };

  // Tap-to-focus: nudge focus to the tapped area (best-effort; no-op if unsupported)
  const handleVideoTap = async () => {
    const track = trackRef.current;
    if (!track) return;
    try {
      await track.applyConstraints({
        advanced: [{ focusMode: "continuous" } as AdvancedTrackConstraint],
      });
    } catch {
      /* noop */
    }
  };

  const toGrams = (a: number, u: Unit) =>
    u === "g" || u === "ml" ? a : u === "dl" ? a * 100 : a * 1000;

  const grams = product ? toGrams(amountNum, unit) * servings : 0;
  const r = grams / 100;
  const totals = product
    ? {
        kcal: product.kcal_per_100g * r,
        p: product.protein_g_per_100g * r,
        c: product.carbs_g_per_100g * r,
        f: product.fat_g_per_100g * r,
      }
    : { kcal: 0, p: 0, c: 0, f: 0 };

  const buildPayload = () => {
    if (!product) throw new Error("Scan a product first");
    const unitLabel =
      unit === "g" ? null : unit === "l" ? `${amountNum} L` : `${amountNum} ${unit}`;
    const qtyLabel = servings > 1 ? ` ×${servings}` : "";
    const name = `${product.brand ? `${product.brand} ` : ""}${product.name}${unitLabel ? ` (${unitLabel})` : ""}${qtyLabel}`;
    return {
      date,
      meal_slot: slot as "breakfast" | "lunch" | "dinner" | "snack",
      name,
      grams,
      kcal: totals.kcal,
      protein_g: totals.p,
      carbs_g: totals.c,
      fat_g: totals.f,
      source: "barcode",
      source_ref: product.code,
    };
  };

  const logMut = useMutation({
    mutationFn: async () => {
      await logFn({ data: buildPayload() });
    },
    onSuccess: () => {
      toast.success(`Logged to ${slot}`);
      onLogged();
      onClose();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to log"),
  });

  const draftMut = useMutation({
    mutationFn: async () => {
      await draftFn({ data: buildPayload() });
    },
    onSuccess: () => {
      toast.success(`Saved to ${slot}, log it later when you're done`);
      onDraftSaved?.();
      onLogged();
      onClose();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to save"),
  });

  const restart = () => {
    setProduct(null);
    setError(null);
    setScanning(true);
    setZoom(1);
    setZoomRange(null);
    setTorchSupported(false);
    setTorchOn(false);
    setTimeout(() => void startScanner(), 50);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex h-[100dvh] max-h-[100dvh] w-full min-w-0 flex-col overflow-hidden rounded-none border border-border bg-onyx-50 pt-[env(safe-area-inset-top,0px)] sm:pt-0 sm:h-auto sm:max-h-[92dvh] sm:max-w-lg sm:rounded-2xl">
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-3 sm:p-4">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 truncate font-display font-bold capitalize">
              <Barcode className="h-4 w-4 shrink-0 text-electric" /> Scan barcode · {slot}
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              Hold 10-20 cm from the barcode. Use zoom for small codes.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-w-0 flex-1 space-y-3 overflow-y-auto px-3 pt-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] sm:p-4">
          {!product && (
            <>
              <div className="flex items-center justify-center gap-1 rounded-lg bg-onyx-100 p-1">
                <button
                  type="button"
                  onClick={() => setShape("long")}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${shape === "long" ? "bg-electric text-onyx-50" : "text-muted-foreground"}`}
                >
                  ▬ Long (EAN / UPC)
                </button>
                <button
                  type="button"
                  onClick={() => setShape("square")}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${shape === "square" ? "bg-electric text-onyx-50" : "text-muted-foreground"}`}
                >
                  ■ Square (QR / DataMatrix)
                </button>
              </div>
              <div
                onClick={handleVideoTap}
                className="relative overflow-hidden rounded-xl border border-electric/40 bg-black aspect-[4/3]"
              >
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  autoPlay
                />
                {scanning && (
                  <>
                    {/* Framed target, rectangle for 1D barcodes, square for 2D codes */}
                    {shape === "long" ? (
                      <div className="pointer-events-none absolute inset-x-6 top-1/2 h-28 -translate-y-1/2 rounded-lg border-2 border-electric shadow-[0_0_25px_rgba(0,180,255,0.5)]">
                        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 animate-pulse bg-electric/80" />
                      </div>
                    ) : (
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-electric shadow-[0_0_25px_rgba(0,180,255,0.5)]" />
                    )}
                    <div className="pointer-events-none absolute inset-3 rounded-lg border border-electric/20" />
                    {torchSupported && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          void toggleTorch();
                        }}
                        aria-label="Toggle flashlight"
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur"
                      >
                        {torchOn ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                      </button>
                    )}
                  </>
                )}
                {lookingUp && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm text-white">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Looking up product…
                  </div>
                )}
              </div>

              {zoomRange && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Zoom
                  </span>
                  <input
                    type="range"
                    min={zoomRange.min}
                    max={zoomRange.max}
                    step={zoomRange.step}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-electric"
                  />
                  <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                    {zoom.toFixed(1)}×
                  </span>
                </div>
              )}

              {error && (
                <div className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-300">
                  {error}
                </div>
              )}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Or enter barcode manually
                </p>
                <div className="flex gap-2">
                  <input
                    inputMode="numeric"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 5000159407236"
                    className="flex-1 rounded-md border border-border bg-onyx-100 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => manualCode && handleCode(manualCode)}
                    disabled={!manualCode || lookingUp}
                    className="rounded-md bg-electric px-3 py-2 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
                  >
                    Look up
                  </button>
                </div>
              </div>
            </>
          )}

          {product && (
            <div className="space-y-3">
              <div className="rounded-xl border border-electric/30 bg-onyx-100 p-3">
                <p className="text-sm font-bold">{product.name}</p>
                {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {product.kcal_per_100g.toFixed(0)} kcal · P{product.protein_g_per_100g.toFixed(1)}{" "}
                  · C{product.carbs_g_per_100g.toFixed(1)} · F{product.fat_g_per_100g.toFixed(1)} /
                  100
                  {product.is_beverage ? "ml" : "g"}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground/70">Code {product.code}</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Amount per serving
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={unit === "l" ? 0.05 : unit === "dl" ? 0.5 : 1}
                    value={amount}
                    placeholder="0"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={() => {
                      if (amount === "" || Number(amount) <= 0) setAmount("0");
                    }}
                    className="w-24 rounded-md border border-border bg-onyx-100 px-3 py-2 text-right text-sm"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as Unit)}
                    className="rounded-md border border-border bg-onyx-100 px-2 py-2 text-sm"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="dl">dl</option>
                    <option value="l">L</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  How many?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    className="rounded-md border border-border bg-onyx-100 p-2 hover:bg-onyx-100/70"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    step={1}
                    value={servings}
                    onChange={(e) =>
                      setServings(
                        Math.max(1, Math.min(99, Math.floor(Number(e.target.value) || 1))),
                      )
                    }
                    className="w-16 rounded-md border border-border bg-onyx-100 px-3 py-2 text-center text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setServings((s) => Math.min(99, s + 1))}
                    className="rounded-md border border-border bg-onyx-100 p-2 hover:bg-onyx-100/70"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-muted-foreground">
                    × {amount}
                    {unit === "g" ? "g" : unit}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-onyx-100/60 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-electric">
                  Your intake
                </p>
                <p className="mt-1 text-lg font-bold">{totals.kcal.toFixed(0)} kcal</p>
                <p className="text-xs text-muted-foreground">
                  P {totals.p.toFixed(1)}g · C {totals.c.toFixed(1)}g · F {totals.f.toFixed(1)}g
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={restart}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-border bg-onyx-100 px-3 py-2.5 text-sm font-semibold hover:bg-onyx-100/70"
                  >
                    <Camera className="h-4 w-4" /> Scan another
                  </button>
                  <button
                    onClick={() => draftMut.mutate()}
                    disabled={draftMut.isPending || logMut.isPending}
                    className="flex-1 rounded-md border border-electric/50 bg-onyx-100 px-3 py-2.5 text-sm font-semibold text-electric hover:bg-electric/10 disabled:opacity-60"
                    title="Save it to this day, log it later when you're done eating"
                  >
                    {draftMut.isPending ? "Saving…" : "Save for later"}
                  </button>
                </div>
                <button
                  onClick={() => logMut.mutate()}
                  disabled={logMut.isPending || draftMut.isPending}
                  className="w-full rounded-md bg-electric px-4 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
                >
                  {logMut.isPending ? "Logging…" : `Log now · ${totals.kcal.toFixed(0)} kcal`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
