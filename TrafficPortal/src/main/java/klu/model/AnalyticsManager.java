package klu.model;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import klu.repository.VehicleRepository;
import klu.repository.TrafficPostRepository;

@Service
public class AnalyticsManager {

    @Autowired
    VehicleRepository VR;

    @Autowired
    TrafficPostRepository TPR;

    public Map<String, Object> getOverview() {
        Map<String, Object> response = new HashMap<>();

        long totalFleet = VR.count();
        long activeVehicles = VR.countByStatus(1);

        // Mocking "Trips Today" as we don't have a BookingRepository linked yet for
        // daily count
        // In a real scenario: bookingRepository.countByStartDate(LocalDate.now());
        int tripsToday = 1025 + new Random().nextInt(50);

        response.put("totalFleet", totalFleet);
        response.put("activeRoutes", activeVehicles); // Assuming 1 active vehicle = 1 active route
        response.put("tripsToday", tripsToday);

        return response;
    }

    public Map<String, Object> getChartData() {
        Map<String, Object> response = new HashMap<>();

        // Mock Congestion Data (Line Chart)
        // Labels: 09:00, 12:00, 15:00, 18:00, 21:00
        int[] congestion = { 65, 40, 45, 80, 55 };
        response.put("congestion", congestion);

        // Mock Emissions Data (Bar Chart)
        // Labels: Mon, Tue, Wed, Thu, Fri, Sat, Sun
        int[] emissions = { 120, 115, 110, 105, 100, 95, 90 };
        response.put("emissions", emissions);

        return response;
    }
}
