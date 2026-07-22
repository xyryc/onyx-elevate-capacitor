import Foundation
import Capacitor
import HealthKit

/// Native HealthKit Capacitor plugin compiled directly into the app binary.
/// This avoids the dynamic framework lazy-loading issue that causes
/// NSClassFromString("HealthPlugin") to return nil at bridge startup.
@objc(HealthPlugin)
public class HealthPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "HealthPlugin"
    public let jsName = "Health"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "checkAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getTodaySummary", returnType: CAPPluginReturnPromise),
    ]

    private let healthStore = HKHealthStore()

    // MARK: - isAvailable

    @objc func isAvailable(_ call: CAPPluginCall) {
        let available = HKHealthStore.isHealthDataAvailable()
        call.resolve([
            "available": available,
            "platform": "ios"
        ])
    }

    // MARK: - requestAuthorization

    @objc func requestAuthorization(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available on this device or simulator.")
            return
        }

        let readIds  = call.getArray("read")  as? [String] ?? []
        let writeIds = call.getArray("write") as? [String] ?? []

        let readTypes  = buildObjectTypes(identifiers: readIds)
        let writeTypes = buildSampleTypes(identifiers: writeIds)

        healthStore.requestAuthorization(toShare: writeTypes, read: readTypes) { _, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject(error.localizedDescription, nil, error)
                } else {
                    call.resolve([
                        "readAuthorized": readIds,
                        "readDenied": [],
                        "writeAuthorized": writeIds,
                        "writeDenied": []
                    ])
                }
            }
        }
    }

    // MARK: - checkAuthorization

    @objc func checkAuthorization(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available on this device or simulator.")
            return
        }

        let readIds  = call.getArray("read")  as? [String] ?? []
        let writeIds = call.getArray("write") as? [String] ?? []

        call.resolve([
            "readAuthorized": readIds,
            "readDenied": [],
            "writeAuthorized": writeIds,
            "writeDenied": []
        ])
    }

    // MARK: - getTodaySummary

    @objc func getTodaySummary(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available on this device or simulator.")
            return
        }

        let group = DispatchGroup()
        var steps: Int? = nil
        var calories: Double? = nil
        var weightKg: Double? = nil
        var heightCm: Double? = nil

        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now, options: .strictStartDate)

        // 1. Steps Today (only populate if HealthKit actually has data)
        if let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount) {
            group.enter()
            let query = HKStatisticsQuery(quantityType: stepType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                if let sum = result?.sumQuantity() {
                    steps = Int(sum.doubleValue(for: HKUnit.count()))
                }
                group.leave()
            }
            healthStore.execute(query)
        }

        // 2. Active Calories Today (only populate if HealthKit actually has data)
        if let calType = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned) {
            group.enter()
            let query = HKStatisticsQuery(quantityType: calType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                if let sum = result?.sumQuantity() {
                    let rawCal = sum.doubleValue(for: HKUnit.kilocalorie())
                    calories = (rawCal * 100).rounded() / 100.0
                }
                group.leave()
            }
            healthStore.execute(query)
        }

        // 3. Most Recent Weight
        if let weightType = HKQuantityType.quantityType(forIdentifier: .bodyMass) {
            group.enter()
            let sortDescriptor = NSSortDescriptor(key: "endDate", ascending: false)
            let query = HKSampleQuery(sampleType: weightType, predicate: nil, limit: 1, sortDescriptors: [sortDescriptor]) { _, samples, _ in
                if let sample = samples?.first as? HKQuantitySample {
                    let rawKg = sample.quantity.doubleValue(for: HKUnit.gramUnit(with: .kilo))
                    weightKg = (rawKg * 10).rounded() / 10.0
                }
                group.leave()
            }
            healthStore.execute(query)
        }

        // 4. Most Recent Height
        if let heightType = HKQuantityType.quantityType(forIdentifier: .height) {
            group.enter()
            let sortDescriptor = NSSortDescriptor(key: "endDate", ascending: false)
            let query = HKSampleQuery(sampleType: heightType, predicate: nil, limit: 1, sortDescriptors: [sortDescriptor]) { _, samples, _ in
                if let sample = samples?.first as? HKQuantitySample {
                    let rawCm = sample.quantity.doubleValue(for: HKUnit.meterUnit(with: .centi))
                    heightCm = (rawCm * 10).rounded() / 10.0
                }
                group.leave()
            }
            healthStore.execute(query)
        }

        group.notify(queue: .main) {
            var res: [String: Any] = [:]
            if let s = steps { res["steps"] = s }
            if let c = calories { res["calories"] = c }
            if let w = weightKg { res["weightKg"] = w }
            if let h = heightCm { res["heightCm"] = h }
            call.resolve(res)
        }
    }

    // MARK: - Helpers

    private func buildObjectTypes(identifiers: [String]) -> Set<HKObjectType> {
        var types: Set<HKObjectType> = []
        for id in identifiers {
            if let t = quantityType(for: id) {
                types.insert(t)
            }
        }
        return types
    }

    private func buildSampleTypes(identifiers: [String]) -> Set<HKSampleType> {
        var types: Set<HKSampleType> = []
        for id in identifiers {
            if let t = quantityType(for: id) as? HKSampleType {
                types.insert(t)
            }
        }
        return types
    }

    private func quantityType(for identifier: String) -> HKObjectType? {
        switch identifier {
        case "steps":    return HKObjectType.quantityType(forIdentifier: .stepCount)
        case "calories": return HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)
        case "weight":   return HKObjectType.quantityType(forIdentifier: .bodyMass)
        case "height":   return HKObjectType.quantityType(forIdentifier: .height)
        default:         return nil
        }
    }
}
