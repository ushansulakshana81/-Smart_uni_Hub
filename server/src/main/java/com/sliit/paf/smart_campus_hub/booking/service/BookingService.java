package com.sliit.paf.smart_campus_hub.booking.service;

import com.sliit.paf.smart_campus_hub.booking.dto.BookingCancelRequest;
import com.sliit.paf.smart_campus_hub.booking.dto.BookingCreateRequest;
import com.sliit.paf.smart_campus_hub.booking.dto.BookingStatusUpdateRequest;
import com.sliit.paf.smart_campus_hub.booking.dto.BookingUpdateRequest;
import com.sliit.paf.smart_campus_hub.booking.entity.Booking;
import com.sliit.paf.smart_campus_hub.booking.entity.BookingResourceType;
import com.sliit.paf.smart_campus_hub.booking.entity.BookingStatus;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {
    List<Booking> getBookings(BookingStatus status, BookingResourceType resourceType, LocalDate fromDate, LocalDate toDate, String search, boolean adminView);
    Booking getBookingById(String bookingId);
    Booking createBooking(BookingCreateRequest request);
    Booking updateBooking(String bookingId, BookingUpdateRequest request);
    Booking reviewBooking(String bookingId, BookingStatusUpdateRequest request);
    Booking cancelBooking(String bookingId, BookingCancelRequest request);
    void deleteBooking(String bookingId);
}
