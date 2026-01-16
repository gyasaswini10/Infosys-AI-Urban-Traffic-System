package klu.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import klu.model.AnalyticsManager;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    AnalyticsManager am;

    @GetMapping("/overview")
    public Map<String, Object> getOverview() {
        return am.getOverview();
    }

    @GetMapping("/charts")
    public Map<String, Object> getChartData() {
        return am.getChartData();
    }
}
