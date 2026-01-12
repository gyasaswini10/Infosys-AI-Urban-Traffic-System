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

}
