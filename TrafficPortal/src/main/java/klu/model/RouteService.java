package klu.model;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.util.*;

@Service
public class RouteService {

    // Helper method to geocode address using Nominatim (Free)
    private double[] getCoordinates(String address) {
        try {
            String url = "https://nominatim.openstreetmap.org/search?format=json&q=" + address.replace(" ", "+");
            RestTemplate restTemplate = new RestTemplate();
            // User-Agent is required by Nominatim policy
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.add("User-Agent", "TrafficPortal/1.0");
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>("parameters",
                    headers);

            org.springframework.http.ResponseEntity<String> result = restTemplate.exchange(url,
                    org.springframework.http.HttpMethod.GET, entity, String.class);

            JsonArray jsonArray = JsonParser.parseString(result.getBody()).getAsJsonArray();
            if (jsonArray.size() > 0) {
                JsonObject location = jsonArray.get(0).getAsJsonObject();
                double lat = location.get("lat").getAsDouble();
                double lon = location.get("lon").getAsDouble();
                return new double[] { lat, lon };
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Map<String, Object> calculateRoutes(String start, String end) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> routes = new ArrayList<>();

        try {
            // 1. Geocode Start and End
            double[] startCoords = getCoordinates(start);
            double[] endCoords = getCoordinates(end);

            if (startCoords != null && endCoords != null) {
                // 2. Call OSRM Route Service (Free)
                // Request alternatives=3 to try getting multiple paths
                String osrmUrl = "http://router.project-osrm.org/route/v1/driving/"
                        + startCoords[1] + "," + startCoords[0] + ";"
                        + endCoords[1] + "," + endCoords[0]
                        + "?overview=full&alternatives=3";

                RestTemplate restTemplate = new RestTemplate();
                String result = restTemplate.getForObject(osrmUrl, String.class);

                JsonObject jsonResponse = JsonParser.parseString(result).getAsJsonObject();

                if (jsonResponse.get("code").getAsString().equals("Ok")) {
                    JsonArray osrmRoutes = jsonResponse.getAsJsonArray("routes");

                    // We need exactly 3 routes: Low, Medium, High Traffic
                    // Base route is usually the fastest (Low Traffic)
                    JsonObject bestRoute = osrmRoutes.get(0).getAsJsonObject();
                    double baseDuration = bestRoute.get("duration").getAsDouble();
                    double baseDistance = bestRoute.get("distance").getAsDouble();
                    String baseGeometry = bestRoute.get("geometry").getAsString();

                    // 1. Low Traffic (Fastest)
                    routes.add(
                            createRouteMap("Low Traffic", baseDuration, baseDistance, "Low", "#10b981", baseGeometry));

                    // 2. Medium Traffic (Simulated or Real Alt)
                    if (osrmRoutes.size() > 1) {
                        JsonObject alt = osrmRoutes.get(1).getAsJsonObject();
                        routes.add(createRouteMap("Medium Traffic", alt.get("duration").getAsDouble(),
                                alt.get("distance").getAsDouble(), "Medium", "#f59e0b",
                                alt.get("geometry").getAsString()));
                    } else {
                        // Simulate Medium: +15% duration
                        routes.add(createRouteMap("Medium Traffic", baseDuration * 1.15, baseDistance, "Medium",
                                "#f59e0b", baseGeometry));
                    }

                    // 3. High Traffic (Simulated or Real Alt)
                    if (osrmRoutes.size() > 2) {
                        JsonObject alt = osrmRoutes.get(2).getAsJsonObject();
                        routes.add(createRouteMap("High Traffic", alt.get("duration").getAsDouble(),
                                alt.get("distance").getAsDouble(), "High", "#ef4444",
                                alt.get("geometry").getAsString()));
                    } else {
                        // Simulate High: +30% duration
                        routes.add(createRouteMap("High Traffic", baseDuration * 1.30, baseDistance, "High", "#ef4444",
                                baseGeometry));
                    }
                }
            } else {
                routes.add(createErrorRoute("Address not found"));
            }

        } catch (Exception e) {
            e.printStackTrace();
            routes.add(createErrorRoute("Error connecting to Routing Service"));
        }

        response.put("start", start);
        response.put("end", end);
        response.put("routes", routes);

        return response;
    }

    private Map<String, Object> createRouteMap(String type, double durationSec, double distanceMeters, String traffic,
            String color, String geometry) {
        Map<String, Object> map = new HashMap<>();
        map.put("type", type);
        map.put("eta", (int) (durationSec / 60) + " mins");
        map.put("distance", (Math.round((distanceMeters / 1000.0) * 10.0) / 10.0) + " km");
        map.put("trafficCondition", traffic);
        map.put("color", color);
        map.put("encodedPath", geometry);
        return map;
    }

    private Map<String, Object> createErrorRoute(String msg) {
        Map<String, Object> map = new HashMap<>();
        map.put("type", msg);
        map.put("eta", "--");
        map.put("distance", "--");
        return map;
    }
}
