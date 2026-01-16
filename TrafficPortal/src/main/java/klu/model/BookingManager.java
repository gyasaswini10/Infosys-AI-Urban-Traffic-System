package klu.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import klu.repository.BookingRepository;

@Service
public class BookingManager {
    @Autowired
    BookingRepository BR;

    public String addBooking(Booking B) {
        BR.save(B);
        return "200::Booking Request Submitted";
    }

    public List<Booking> getAllBookings() {
        return BR.findAll();
    }

    public List<Booking> getCustomerBookings(String customerId) {
        return BR.findByCustomerId(customerId);
    }

    public String updateStatus(Long bookingId, Integer status) {
        Booking B = BR.findById(bookingId).get();
        B.setStatus(status);
        BR.save(B);
        return "200::Booking Status Updated";
    }
}
