import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import heroImg from "@/assets/athlete-power.jpg";
import strengthImg from "@/assets/athlete-strength.jpg";
import coachImg from "@/assets/athlete-coach.jpg";
import conditioningImg from "@/assets/athlete-conditioning.jpg";

type Slot = { key: string; label: string; fallback: string };

const SLOTS: Slot[] = [
  { key: "home.hero", label: "Home, Hero", fallback: heroImg },
  { key: "home.card.strength", label: "Home, Strength card", fallback: strengthImg },
  { key: "home.card.conditioning", label: "Home, Conditioning card", fallback: conditioningImg },
  { key: "home.card.coach", label: "Home, Coaching card", fallback: coachImg },
];

export const Route = createFileRoute("/_authenticated/admin/images")({
  ssr: false,
  component: AdminImagesPage,
});

function AdminImagesPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
      const { data: rows } = await supabase.from("image_overrides").select("slot_key,image_url");
      const map: Record<string, string> = {};
      for (const r of rows ?? []) map[r.slot_key] = r.image_url;
      setOverrides(map);
      setLoading(false);
    })();
  }, []);

  async function saveSlot(slot: string, url: string) {
    const { error } = await supabase.from("image_overrides").upsert({
      slot_key: slot,
      image_url: url,
      updated_by: (await supabase.auth.getUser()).data.user?.id,
    });
    if (error) return toast.error(error.message);
    setOverrides((o) => ({ ...o, [slot]: url }));
    toast.success("Saved");
  }

  async function clearSlot(slot: string) {
    const { error } = await supabase.from("image_overrides").delete().eq("slot_key", slot);
    if (error) return toast.error(error.message);
    setOverrides((o) => {
      const n = { ...o };
      delete n[slot];
      return n;
    });
    toast.success("Reset to default");
  }

  async function uploadFor(slot: string, file: File) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${slot.replace(/\./g, "_")}-${Date.now()}.${ext}`;
    const up = await supabase.storage.from("site-images").upload(path, file, {
      upsert: true,
      cacheControl: "31536000",
      contentType: file.type,
    });
    if (up.error) return toast.error(up.error.message);
    const signed = await supabase.storage
      .from("site-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    if (signed.error || !signed.data) return toast.error(signed.error?.message || "Sign failed");
    await saveSlot(slot, signed.data.signedUrl);
  }

  if (loading) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!isAdmin) {
    return (
      <div className="container mx-auto max-w-2xl py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="text-muted-foreground">
          Your account needs the <code className="px-1 bg-muted rounded">admin</code> role. Add a
          row in the
          <code className="px-1 bg-muted rounded">user_roles</code> table with your user id and
          role=admin.
        </p>
        <Link to="/" className="text-primary underline">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Image Manager</h1>
        <p className="text-muted-foreground">
          Swap hero and card photos across the site. Upload a file or paste any image URL.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SLOTS.map((slot) => (
          <SlotCard
            key={slot.key}
            slot={slot}
            current={overrides[slot.key]}
            onSave={(url) => saveSlot(slot.key, url)}
            onClear={() => clearSlot(slot.key)}
            onUpload={(f) => uploadFor(slot.key, f)}
          />
        ))}
      </div>
    </div>
  );
}

function SlotCard({
  slot,
  current,
  onSave,
  onClear,
  onUpload,
}: {
  slot: Slot;
  current?: string;
  onSave: (url: string) => void;
  onClear: () => void;
  onUpload: (f: File) => void;
}) {
  const [url, setUrl] = useState(current ?? "");
  const preview = current || slot.fallback;
  useEffect(() => {
    setUrl(current ?? "");
  }, [current]);
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{slot.label}</div>
          <code className="text-xs text-muted-foreground">{slot.key}</code>
        </div>
        {current && (
          <span className="text-xs px-2 py-0.5 rounded bg-primary/15 text-primary">Custom</span>
        )}
      </div>
      <img
        src={preview}
        alt=""
        className="w-full aspect-video object-cover rounded-md border border-border"
        decoding="async"
      />
      <div className="flex gap-2">
        <Input
          placeholder="Paste image URL or upload below"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={() => onSave(url)} disabled={!url}>
          Save
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
        />
        {current && (
          <Button variant="ghost" onClick={onClear}>
            Reset
          </Button>
        )}
      </div>
    </Card>
  );
}
