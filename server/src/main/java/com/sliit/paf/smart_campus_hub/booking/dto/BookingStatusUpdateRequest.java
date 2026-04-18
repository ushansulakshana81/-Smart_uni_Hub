package com.sliit.paf.smart_campus_hub.booking.dto;

import com.sliit.paf.smart_campus_hub.booking.entity.BookingDecisionType;
import com.sliit.paf.smart_campus_hub.booking.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingStatusUpdateRequest {
    @NotNull(message = "Decision is required")
    private BookingDecisionType decision;

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String reason;
}
