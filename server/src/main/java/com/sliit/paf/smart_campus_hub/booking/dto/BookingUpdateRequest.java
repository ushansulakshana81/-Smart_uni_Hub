package com.sliit.paf.smart_campus_hub.booking.dto;

import com.sliit.paf.smart_campus_hub.booking.entity.BookingResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingUpdateRequest {
    @NotNull(message = "Resource type is required")
    private BookingResourceType resourceType;

    @NotBlank(message = "Resource id is required")
    private String resourceId;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    private Integer expectedAttendees;

    @NotBlank(message = "Purpose is required")
    private String purpose;
}
