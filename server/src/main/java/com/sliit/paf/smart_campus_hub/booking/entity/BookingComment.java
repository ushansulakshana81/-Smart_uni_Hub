package com.sliit.paf.smart_campus_hub.booking.entity;

import com.sliit.paf.smart_campus_hub.usermanagement.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingComment {
    private String id;
    private String message;
    private String createdByUserId;
    private String createdByName;
    private Role createdByRole;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
