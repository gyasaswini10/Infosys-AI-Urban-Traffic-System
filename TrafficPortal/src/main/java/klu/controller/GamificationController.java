package klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import klu.model.GamificationManager;
import java.util.Map;

@RestController
@RequestMapping("/gamification")
@CrossOrigin(origins = "*") // Allow frontend access
public class GamificationController {

    @Autowired
    GamificationManager gm;

    @GetMapping("/driver/{email}")
    public Map<String, Object> getDriverStats(@PathVariable("email") String email) {
        return gm.getDriverStats(email);
    }
}
