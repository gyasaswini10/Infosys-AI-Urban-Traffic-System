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
                // Format: /route/v1/driving/{lon},{lat};{lon},{lat}?overview=full
                String osrmUrl = "http://router.project-osrm.org/route/v1/driving/"
                        + startCoords[1] + "," + startCoords[0] + ";"
                        + endCoords[1] + "," + endCoords[0]
                        + "?overview=full"; // full polyline

                RestTemplate restTemplate = new RestTemplate();
                String result = restTemplate.getForObject(osrmUrl, String.class);

                JsonObject jsonResponse = JsonParser.parseString(result).getAsJsonObject();

                if (jsonResponse.get("code").getAsString().equals("Ok")) {
                    JsonArray osrmRoutes = jsonResponse.getAsJsonArray("routes");

                    // OSRM usually returns 1 main route, but can support alternatives. We verify
                    // just the first one here.
                    for (int i = 0; i < osrmRoutes.size(); i++) {
                        JsonObject routeObj = osrmRoutes.get(i).getAsJsonObject();

                        double durationSeconds = routeObj.get("duration").getAsDouble();
                        double distanceMeters = routeObj.get("distance").getAsDouble();
                        String geometry = routeObj.get("geometry").getAsString(); // Encoded polyline

                        Map<String, Object> routeMap = new HashMap<>();
                        routeMap.put("type", "Recommended Route");
                        // Format Duration
                        int minutes = (int) (durationSeconds / 60);
                        routeMap.put("eta", minutes + " mins");
                        // Format Distance
                        double km = Math.round((distanceMeters / 1000.0) * 10.0) / 10.0;
                        routeMap.put("distance", km + " km");

                        routeMap.put("trafficCondition", "Normal"); // OSRM basic doesn't have real-time traffic
                        routeMap.put("color", "#10b981"); // Green
                        routeMap.put("encodedPath", geometry);

                        routes.add(routeMap);
                    }
                }
            } else {
                Map<String, Object> errorRoute = new HashMap<>();
                errorRoute.put("type", "Address not found");
                errorRoute.put("eta", "--");
                errorRoute.put("distance", "--");
                routes.add(errorRoute);
            }

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorRoute = new HashMap<>();
            errorRoute.put("type", "Error connecting to Routing Service");
            errorRoute.put("eta", "--");
            errorRoute.put("distance", "--");
            routes.add(errorRoute);
        }

        response.put("start", start);
        response.put("end", end);
        response.put("routes", routes);

        return response;
    }
}
