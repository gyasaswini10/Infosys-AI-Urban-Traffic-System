package klu.model;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class RouteService {

    // Dynamic Route Calculation (Simulated AI Logic)
    public Map<String, Object> calculateRoutes(String start, String end) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> routes = new ArrayList<>();

        // 1. Fastest Route (AI Optimized)
        Map<String, Object> fastest = new HashMap<>();
        fastest.put("type", "Fastest");
        fastest.put("eta", "24 mins");
        fastest.put("distance", "12 km");
        fastest.put("trafficCondition", "Moderate");
        fastest.put("color", "#10b981"); // Green
        fastest.put("co2", "2.4 kg");
        routes.add(fastest);

        // 2. Eco-Friendly Route (Greenest)
        Map<String, Object> eco = new HashMap<>();
        eco.put("type", "Eco-Friendly");
        eco.put("eta", "30 mins"); // Slower
        eco.put("distance", "14 km");
        eco.put("trafficCondition", "Low"); // Less jam = less idle fuel
        eco.put("color", "#3b82f6"); // Blue
        eco.put("co2", "1.8 kg"); // Lower CO2
        routes.add(eco);

        // 3. Public Transport Option (Multimodal)
        Map<String, Object> publicTx = new HashMap<>();
        publicTx.put("type", "Public Transport");
        publicTx.put("eta", "45 mins");
        publicTx.put("distance", "Fixed Line");
        publicTx.put("trafficCondition", "N/A");
        publicTx.put("color", "#f59e0b"); // Orange
        publicTx.put("co2", "0.4 kg"); // Very low CO2
        routes.add(publicTx);

        response.put("start", start);
        response.put("end", end);
        response.put("routes", routes);

        return response;
    }
}
