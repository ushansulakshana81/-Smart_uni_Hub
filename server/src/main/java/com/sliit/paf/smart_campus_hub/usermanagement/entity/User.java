package com.sliit.paf.smart_campus_hub.usermanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true, sparse = true)
    private String nic;

    private String firstName;
    private String lastName;
    private String password;
    private String profilePictureUrl;

    @Indexed
    private Role role;

    @Indexed
    private UserStatus status;

    private String googleId;
    private String googleEmail;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;

    private boolean emailVerified;
    private LocalDateTime emailVerifiedAt;

    private String phoneNumber;
    private String department;

    public void updateLastLogin() {
        this.lastLogin = LocalDateTime.now();
    }
}
