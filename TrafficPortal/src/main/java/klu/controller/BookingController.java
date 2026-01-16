package klu.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import klu.model.Booking;
import klu.model.BookingManager;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    BookingManager BM;

    @PostMapping("/add")
    public String addBooking(@RequestBody Booking B) {
        return BM.addBooking(B);
    }

    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return BM.getAllBookings();
    }

    @GetMapping("/customer/{id}")
    public List<Booking> getCustomerBookings(@PathVariable("id") String id) {
        return BM.getCustomerBookings(id);
    }

    @PostMapping("/updateStatus")
    public String updateStatus(@RequestBody Map<String, Object> payload) {
        Long bookingId = Long.valueOf(payload.get("bookingId").toString());
        Integer status = Integer.valueOf(payload.get("status").toString());
        return BM.updateStatus(bookingId, status);
    }
}
