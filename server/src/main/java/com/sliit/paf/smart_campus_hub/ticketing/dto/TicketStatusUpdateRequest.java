package com.sliit.paf.smart_campus_hub.ticketing.dto;

import com.sliit.paf.smart_campus_hub.ticketing.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private TicketStatus status;

    private String resolutionNotes;
}
