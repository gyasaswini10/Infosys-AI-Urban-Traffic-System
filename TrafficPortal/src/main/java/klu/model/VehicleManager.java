package klu.model;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import klu.repository.VehicleRepository;

@Service
public class VehicleManager {
    @Autowired
    VehicleRepository VR;

    public String addVehicle(Vehicle V) {
        try {
            // Check for duplicates if needed, but regNo is unique
            if (V.getLocation() == null || V.getLocation().isEmpty())
                V.setLocation("Garage"); // Default location
            if (V.getSpeed() == null || V.getSpeed() == 0)
                V.setSpeed(0); // Default stationary
            if (V.getBatteryLevel() == null || V.getBatteryLevel() == 0)
                V.setBatteryLevel(100); // Default full charge

            // Randomize Health for Simulation
            if (V.getEngineHealth() == null || V.getEngineHealth() == 0)
                V.setEngineHealth(80 + (int) (Math.random() * 20)); // 80-100%
            if (V.getTireHealth() == null || V.getTireHealth() == 0)
                V.setTireHealth(70 + (int) (Math.random() * 30)); // 70-100%
            if (V.getMileage() == null || V.getMileage() == 0)
                V.setMileage(Math.random() * 50000);
            if (V.getLastServiceDate() == null)
                V.setLastServiceDate("2024-01-01");

            VR.save(V);
            return "200::Vehicle Added Successfully";
        } catch (Exception e) {
            return "500::Error Adding Vehicle: " + e.getMessage();
        }
    }

    public List<Vehicle> getAllVehicles() {
        return VR.findAll();
    }

    public Map<String, Long> getVehicleStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", VR.count());
        stats.put("active", VR.countByStatus(1));
        stats.put("inactive", VR.countByStatus(2));
        return stats;
    }
}
