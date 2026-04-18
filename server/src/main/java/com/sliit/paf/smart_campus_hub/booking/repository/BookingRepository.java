package com.sliit.paf.smart_campus_hub.booking.repository;

import com.sliit.paf.smart_campus_hub.booking.entity.Booking;
import com.sliit.paf.smart_campus_hub.booking.entity.BookingResourceType;
import com.sliit.paf.smart_campus_hub.booking.entity.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    boolean existsByBookingCode(String bookingCode);
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByCreatedByUserIdOrderByCreatedAtDesc(String createdByUserId);
    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);
    List<Booking> findByResourceTypeOrderByCreatedAtDesc(BookingResourceType resourceType);
    List<Booking> findByBookingDateOrderByStartTimeAsc(LocalDate bookingDate);
    List<Booking> findByResourceTypeAndResourceIdAndBookingDateAndStatusIn(
            BookingResourceType resourceType,
            String resourceId,
            LocalDate bookingDate,
            List<BookingStatus> statusList
    );
    List<Booking> findByBookingDateBetween(LocalDate from, LocalDate to);
}
