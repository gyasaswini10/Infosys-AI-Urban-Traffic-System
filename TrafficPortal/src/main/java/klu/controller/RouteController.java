package klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import klu.model.RouteService;
import java.util.Map;

@RestController
@RequestMapping("/route")
public class RouteController {

    @Autowired
    RouteService RS;

    @GetMapping("/optimize")
    public Map<String, Object> getOptimizedRoutes(@RequestParam("start") String start,
            @RequestParam("end") String end) {
        return RS.calculateRoutes(start, end);
    }
}
