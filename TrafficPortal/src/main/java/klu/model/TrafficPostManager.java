package klu.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import klu.repository.TrafficPostRepository;

@Service
public class TrafficPostManager {
    @Autowired
    TrafficPostRepository TPR;

    public String addTrafficPost(TrafficPost tp) {
        try {
            TPR.save(tp);
            return "200::Traffic Incident Posted Successfully";
        } catch (Exception e) {
            return "500::Error Posting Incident: " + e.getMessage();
        }
    }

    public List<TrafficPost> getAllTrafficPosts() {
        return TPR.findAll();
    }

    public String deleteTrafficPost(Long id) {
        try {
            TPR.deleteById(id);
            return "200::Deleted Successfully";
        } catch (Exception e) {
            return "500::Error Deleting: " + e.getMessage();
        }
    }

    public TrafficPost getTrafficPost(Long id) {
        return TPR.findById(id).get();
    }

    public List<TrafficPost> getTrafficPostsByLocation(String keyword) {
        return TPR.postsByLocation(keyword);
    }

    public java.util.Map<String, Long> getIncidentStats() {
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("total", TPR.countAllPosts());
        stats.put("high", TPR.countBySeverity("High"));
        stats.put("medium", TPR.countBySeverity("Medium"));
        stats.put("low", TPR.countBySeverity("Low"));
        stats.put("critical", TPR.countBySeverity("Critical"));
        return stats;
    }
}
