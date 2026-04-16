package com.sliit.paf.smart_campus_hub.usermanagement.dto;

import com.sliit.paf.smart_campus_hub.usermanagement.entity.Role;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String nic;
    private Role role;
    private UserStatus status;
    private String accessToken;
    private String refreshToken;
    private LocalDateTime expiresAt;
}
