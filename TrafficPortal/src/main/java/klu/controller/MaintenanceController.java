package klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import klu.model.Vehicle;
import klu.model.VehicleManager;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/maintenance")
public class MaintenanceController {

    @Autowired
    VehicleManager VM;

    @GetMapping("/prediction")
    public List<Map<String, Object>> getMaintenancePredictions() {
        List<Vehicle> vehicles = VM.getAllVehicles();
        List<Map<String, Object>> predictions = new ArrayList<>();

        for (Vehicle v : vehicles) {
            Map<String, Object> record = new HashMap<>();
            // Handle potential nulls with defaults
            int engineHealth = v.getEngineHealth() != null ? v.getEngineHealth() : 100;
            int tireHealth = v.getTireHealth() != null ? v.getTireHealth() : 100;
            double mileage = v.getMileage() != null ? v.getMileage() : 0.0;

            record.put("vehicleId", v.getVehicleId());
            record.put("regNo", v.getRegNo());
            record.put("engineHealth", engineHealth);
            record.put("tireHealth", tireHealth);
            record.put("mileage", mileage);

            // Prediction Logic
            List<String> issues = new ArrayList<>();
            String status = "Healthy";
            String action = "None";

            if (engineHealth < 70) {
                issues.add("Engine Wear");
                status = "Critical";
                action = "Immediate Service";
            } else if (engineHealth < 85) {
                issues.add("Minor Engine Check");
                if (!status.equals("Critical")) {
                    status = "Due Soon";
                    action = "Schedule Checkup";
                }
            }

            if (tireHealth < 60) {
                issues.add("Tire Replacement");
                status = "Critical";
                action = "Replace Tires";
            } else if (tireHealth < 80) {
                issues.add("Tire Rotation");
                if (!status.equals("Critical")) {
                    status = "Due Soon";
                    action = "Rotate Tires";
                }
            }

            if (mileage > 100000) {
                issues.add("High Mileage Service");
                if (!status.equals("Critical")) {
                    status = "Due Soon";
                    action = "Full Service";
                }
            }

            record.put("status", status);
            record.put("action", action);
            record.put("issues", String.join(", ", issues));

            predictions.add(record);
        }
        return predictions;
    }
}
