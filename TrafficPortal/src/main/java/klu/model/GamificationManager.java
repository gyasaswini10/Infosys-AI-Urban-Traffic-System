package klu.model;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@Service
public class GamificationManager {

    public Map<String, Object> getDriverStats(String email) {
        Map<String, Object> stats = new HashMap<>();
        
        // Mock Data based on email hash to give "dynamic" feel or just static specific data
        // In real app, fetch from DB
        stats.put("ecoScore", 94);
        stats.put("rewardPoints", 4500);
        stats.put("rank", "Gold");
        
        List<Map<String, String>> achievements = new ArrayList<>();
        
        Map<String, String> a1 = new HashMap<>();
        a1.put("icon", "🌱");
        a1.put("title", "Eco Warrior");
        a1.put("desc", "Saved 50kg CO2 this month");
        a1.put("status", "unlocked");
        achievements.add(a1);
        
        Map<String, String> a2 = new HashMap<>();
        a2.put("icon", "⏱️");
        a2.put("title", "On Time");
        a2.put("desc", "98% On-time arrivals");
        a2.put("status", "unlocked");
        achievements.add(a2);
        
        Map<String, String> a3 = new HashMap<>();
        a3.put("icon", "🛡️");
        a3.put("title", "Safety First");
        a3.put("desc", "No harsh braking for 1000km");
        a3.put("status", "locked");
        achievements.add(a3);
        
        stats.put("achievements", achievements);
        
        return stats;
    }
}
