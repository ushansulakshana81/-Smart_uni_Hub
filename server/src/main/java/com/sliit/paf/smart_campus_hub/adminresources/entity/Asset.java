package com.sliit.paf.smart_campus_hub.adminresources.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {
    @Id
    private String id;

    @Indexed(unique = true)
    private String assetId;

    private String name;
    private String category;
    private String location;
    private String status;
    private String condition;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
