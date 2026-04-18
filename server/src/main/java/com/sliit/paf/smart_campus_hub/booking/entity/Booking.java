package com.sliit.paf.smart_campus_hub.booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    @Id
    private String id;

    @Indexed(unique = true)
    private String bookingCode;

    private BookingResourceType resourceType;
    private String resourceId;
    private String resourceName;
    private String resourceDisplayName;
    private String location;

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer expectedAttendees;
    private String purpose;

    private BookingStatus status;
    private String reviewReason;
    private String cancelReason;

    private String createdByUserId;
    private String createdByName;
    private String createdByEmail;
    private String reviewedByUserId;
    private String reviewedByName;

    @Builder.Default
    private List<BookingComment> comments = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime cancelledAt;
}
