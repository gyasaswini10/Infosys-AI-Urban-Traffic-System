package klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import klu.model.TrafficPost;
import klu.model.TrafficPostManager;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/traffic")
public class TrafficPostController {

    @Autowired
    TrafficPostManager tpm;

    @PostMapping("/create")
    public String create(@RequestBody TrafficPost tp) {
        return tpm.addTrafficPost(tp);
    }

    @GetMapping("/read")
    public List<TrafficPost> read() {
        return tpm.getAllTrafficPosts();
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable("id") Long id) {
        return tpm.deleteTrafficPost(id);
    }

    @GetMapping("/getdata/{id}")
    public TrafficPost getdata(@PathVariable("id") Long id) {
        return tpm.getTrafficPost(id);
    }

    @GetMapping("/search/{keyword}")
    public List<TrafficPost> search(@PathVariable("keyword") String keyword) {
        return tpm.getTrafficPostsByLocation(keyword);
    }

    @GetMapping("/stats")
    public java.util.Map<String, Long> getStats() {
        return tpm.getIncidentStats();
    }

    @PostMapping("/updateStatus")
    public String updateStatus(@RequestBody TrafficPost tp) {
        return tpm.updateTrafficPostStatus(tp.getId(), tp.getStatus());
    }

    @GetMapping("/predict")
    public java.util.Map<String, Object> predictTraffic() {
        // Simulating AI Prediction Model based on historical data
        java.util.Map<String, Object> prediction = new java.util.HashMap<>();
        prediction.put("tomorrowPeak", "09:00 AM - 11:00 AM");
        prediction.put("congestionLevel", "High");
        prediction.put("affectedAreas", java.util.Arrays.asList("MG Road", "Hitech City Junction"));
        return prediction;
    }

    @GetMapping("/public-transport")
    public java.util.Map<String, Object> getPublicTransportStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("metroDelays", "None");
        stats.put("busCongestion", "Moderate (Route 45, 12)");
        stats.put("activeFleet", 150);
        return stats;
    }

}
