package com.sliit.paf.smart_campus_hub.ticketing.dto;

import com.sliit.paf.smart_campus_hub.ticketing.entity.TicketIssueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketUpdateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Issue type is required")
    private TicketIssueType issueType;

    @NotBlank(message = "Facility or asset name is required")
    private String facilityOrAssetName;

    @NotBlank(message = "Location is required")
    private String location;
}
