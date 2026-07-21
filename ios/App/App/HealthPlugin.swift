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
