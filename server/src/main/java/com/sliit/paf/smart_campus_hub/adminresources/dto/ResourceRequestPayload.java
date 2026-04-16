package com.sliit.paf.smart_campus_hub.adminresources.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceRequestPayload {
    @NotBlank(message = "Resource type is required")
    private String resourceType;

    @NotBlank(message = "Facility or asset is required")
    private String facilityOrAsset;

    @NotBlank(message = "Date is required")
    private String date;

    @NotBlank(message = "Time is required")
    private String time;

    @NotBlank(message = "Purpose is required")
    private String purpose;
}
