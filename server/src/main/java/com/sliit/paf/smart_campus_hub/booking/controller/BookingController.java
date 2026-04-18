package com.sliit.paf.smart_campus_hub.booking.controller;

import com.sliit.paf.smart_campus_hub.booking.dto.BookingCancelRequest;
import com.sliit.paf.smart_campus_hub.booking.dto.BookingCreateRequest;
import com.sliit.paf.smart_campus_hub.booking.dto.BookingStatusUpdateRequest;
import com.sliit.paf.smart_campus_hub.booking.dto.BookingUpdateRequest;
import com.sliit.paf.smart_campus_hub.booking.entity.BookingResourceType;
import com.sliit.paf.smart_campus_hub.booking.entity.BookingStatus;
import com.sliit.paf.smart_campus_hub.booking.service.BookingService;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@Slf4j
@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) BookingResourceType resourceType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "false") boolean adminView) {
        return ResponseEntity.ok(new ApiResponse(true, "Bookings retrieved successfully",
                bookingService.getBookings(status, resourceType, fromDate, toDate, search, adminView)));
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getBookingById(@PathVariable String bookingId) {
        return ResponseEntity.ok(new ApiResponse(true, "Booking retrieved successfully", bookingService.getBookingById(bookingId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createBooking(@Valid @RequestBody BookingCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Booking created successfully", bookingService.createBooking(request)));
    }

    @PutMapping("/{bookingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateBooking(@PathVariable String bookingId, @Valid @RequestBody BookingUpdateRequest request) {
        return ResponseEntity.ok(new ApiResponse(true, "Booking updated successfully", bookingService.updateBooking(bookingId, request)));
    }

    @PatchMapping("/{bookingId}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> reviewBooking(@PathVariable String bookingId, @Valid @RequestBody BookingStatusUpdateRequest request) {
        return ResponseEntity.ok(new ApiResponse(true, "Booking reviewed successfully", bookingService.reviewBooking(bookingId, request)));
    }

    @PatchMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> cancelBooking(@PathVariable String bookingId, @Valid @RequestBody BookingCancelRequest request) {
        return ResponseEntity.ok(new ApiResponse(true, "Booking cancelled successfully", bookingService.cancelBooking(bookingId, request)));
    }

    @DeleteMapping("/{bookingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteBooking(@PathVariable String bookingId) {
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.ok(new ApiResponse(true, "Booking deleted successfully"));
    }
}
