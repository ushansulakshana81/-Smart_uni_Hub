package com.sliit.paf.smart_campus_hub.ticketing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponseCreateRequest {
    @NotBlank(message = "Response message is required")
    private String message;
}
