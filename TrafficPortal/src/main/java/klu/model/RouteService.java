package klu.model;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RouteService {

    public Map<String, Object> getOptimizedRoutes(String start, String end) {
        Map<String, Object> response = new HashMap<>();
        response.put("start", start);
        response.put("end", end);

        List<Map<String, Object>> routes = new ArrayList<>();

        // 1. Fastest Route (AI Predicted)
        Map<String, Object> fastRoute = new HashMap<>();
        fastRoute.put("type", "Fastest");
        fastRoute.put("eta", "15 mins");
        fastRoute.put("distance", "8.5 km");
        fastRoute.put("trafficCondition", "Low");
        fastRoute.put("color", "#10b981"); // Green
        routes.add(fastRoute);

        // 2. Eco-Friendly Route
        Map<String, Object> ecoRoute = new HashMap<>();
        ecoRoute.put("type", "Eco-Friendly");
        ecoRoute.put("eta", "22 mins");
        ecoRoute.put("distance", "9.2 km");
        ecoRoute.put("trafficCondition", "Moderate");
        ecoRoute.put("color", "#3b82f6"); // Blue
        routes.add(ecoRoute);

        // 3. Balanced Route
        Map<String, Object> balancedRoute = new HashMap<>();
        balancedRoute.put("type", "Balanced");
        balancedRoute.put("eta", "18 mins");
        balancedRoute.put("distance", "8.8 km");
        balancedRoute.put("trafficCondition", "Medium");
        balancedRoute.put("color", "#f59e0b"); // Orange
        routes.add(balancedRoute);

        response.put("routes", routes);
        return response;
    }
}
