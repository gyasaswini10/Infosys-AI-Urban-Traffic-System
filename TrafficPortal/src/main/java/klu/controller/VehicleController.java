package klu.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import klu.model.Vehicle;
import klu.model.VehicleManager;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/vehicle")
public class VehicleController {

    @Autowired
    VehicleManager vm;

    @PostMapping("/add")
    public String addVehicle(@RequestBody Vehicle V) {
        return vm.addVehicle(V);
    }

    @GetMapping("/all")
    public List<Vehicle> getAllVehicles() {
        return vm.getAllVehicles();
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return vm.getVehicleStats();
    }

}
