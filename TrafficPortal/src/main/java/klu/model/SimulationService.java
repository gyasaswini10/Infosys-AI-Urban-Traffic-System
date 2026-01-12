package klu.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import klu.repository.VehicleRepository;

import java.util.List;
import java.util.Random;

@Service
public class SimulationService {

    @Autowired
    VehicleRepository VR;

    private Random random = new Random();

    // Runs every 5 seconds
    @Scheduled(fixedRate = 5000)
    public void simulateVehicleTelemetry() {
        List<Vehicle> vehicles = VR.findAll();

        for (Vehicle v : vehicles) {
            // Only simulate active vehicles (Status 1)
            // Use safe unboxing for status
            if (v.getStatus() != null && v.getStatus() == 1) {
                // 1. Simulate Speed
                // Random speed between 20 and 100 km/h
                int newSpeed = 20 + random.nextInt(81);
                v.setSpeed(newSpeed);

                // 2. Simulate Battery/Fuel Drain
                // Drain 1% every cycle if speed > 0
                // Default to 100 if null to allow simulation to start, or 0 if preferred. Using
                // 0 safe check.
                double currentBattery = v.getBatteryLevel() != null ? v.getBatteryLevel() : 0.0;

                if (currentBattery > 0) {
                    v.setBatteryLevel((int) (currentBattery - 1.0));
                } else {
                    // Stop vehicle if battery dead
                    v.setSpeed(0);
                    v.setStatus(2); // Set to inactive
                }

                // 3. Simulate Mileage
                // Add approximate distance covered in 5 sec at current speed
                // Dist = Speed (km/h) * Time (h)
                // 5 sec = 5/3600 hours
                double distanceCovered = (newSpeed * 5.0) / 3600.0;
                double currentMileage = v.getMileage() != null ? v.getMileage() : 0.0;
                v.setMileage(currentMileage + distanceCovered);

                // 4. Simulate Engine/Tire Wear (Slow degradation)
                if (random.nextDouble() < 0.1) { // 10% chance to degrade per cycle
                    int engineHealth = v.getEngineHealth() != null ? v.getEngineHealth() : 100;
                    if (engineHealth > 0)
                        v.setEngineHealth((int) (engineHealth - 0.5));

                    int tireHealth = v.getTireHealth() != null ? v.getTireHealth() : 100;
                    if (tireHealth > 0)
                        v.setTireHealth((int) (tireHealth - 0.5));
                }

            } else {
                // Idle vehicles
                v.setSpeed(0);
                // Charging logic if inactive? For now just stay idle.
            }

            // Save updates
            VR.save(v);
        }

        // System.out.println("Simulation cycle completed for " + vehicles.size() + "
        // vehicles.");
    }
}
