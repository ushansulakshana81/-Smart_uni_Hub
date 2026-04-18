package com.sliit.paf.smart_campus_hub.booking.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingCancelRequest {
    @Size(max = 500, message = "Cancel reason must be 500 characters or less")
    private String reason;
}
