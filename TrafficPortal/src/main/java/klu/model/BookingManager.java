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
        List<Booking> bookings = BR.findByCustomerId(customerId);
        if (bookings.isEmpty()) {
            // Mock data for demo purposes if DB is empty
            bookings = new ArrayList<>();

            Booking b1 = new Booking();
            b1.setBookingId(101L);
            b1.setCustomerId(customerId);
            b1.setVehicleId(55L); // Tesla Model 3
            b1.setStartDate("2025-01-15");
            b1.setEndDate("2025-01-15");
            b1.setStatus(2); // Approved
            bookings.add(b1);

            Booking b2 = new Booking();
            b2.setBookingId(102L);
            b2.setCustomerId(customerId);
            b2.setVehicleId(89L); // Volvo Bus
            b2.setStartDate("2025-01-10");
            b2.setEndDate("2025-01-10");
            b2.setStatus(4); // Completed
            bookings.add(b2);
        }
        return bookings;
    }

    public String updateStatus(Long bookingId, Integer status) {
        Booking B = BR.findById(bookingId).get();
        B.setStatus(status);
        BR.save(B);
        return "200::Booking Status Updated";
    }
}
