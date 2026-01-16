package klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import klu.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("select B from Booking B where B.customerId = :customerId")
    public List<Booking> findByCustomerId(@Param("customerId") String customerId);

    @Query("select B from Booking B where B.status = :status")
    public List<Booking> findByStatus(@Param("status") Integer status);
}
