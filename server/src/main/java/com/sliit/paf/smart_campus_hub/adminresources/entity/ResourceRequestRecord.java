package com.sliit.paf.smart_campus_hub.adminresources.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "resource_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceRequestRecord {
    @Id
    private String id;

    @Indexed(unique = true)
    private String requestId;

    private String resourceType;
    private String facilityOrAsset;
    private String date;
    private String time;
    private String purpose;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
