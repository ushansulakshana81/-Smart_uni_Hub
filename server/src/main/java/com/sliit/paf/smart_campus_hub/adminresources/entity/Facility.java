package com.sliit.paf.smart_campus_hub.adminresources.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "facilities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility {
    @Id
    private String id;

    @Indexed(unique = true)
    private String fId;

    private String facilityName;
    private String type;
    private String location;
    private Integer capacity;
    private String availability;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
