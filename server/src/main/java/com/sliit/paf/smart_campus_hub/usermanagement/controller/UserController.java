package com.sliit.paf.smart_campus_hub.usermanagement.controller;

import com.sliit.paf.smart_campus_hub.usermanagement.dto.ApiResponse;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.UserDTO;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.UserProfileUpdateRequest;
import com.sliit.paf.smart_campus_hub.usermanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable String id) {
        log.info("Get user by ID endpoint called for ID: {}", id);
        try {
            UserDTO userDTO = userService.getUserById(id);
            return ResponseEntity.ok(new ApiResponse(true, "User retrieved successfully", userDTO));
        } catch (Exception e) {
            log.error("Get user error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getUserByEmail(@PathVariable String email) {
        log.info("Get user by email endpoint called for email: {}", email);
        try {
            UserDTO userDTO = userService.getUserByEmail(email);
            return ResponseEntity.ok(new ApiResponse(true, "User retrieved successfully", userDTO));
        } catch (Exception e) {
            log.error("Get user error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateUserProfile(@PathVariable String id,
                                                         @Valid @RequestBody UserProfileUpdateRequest request) {
        log.info("Update user profile endpoint called for ID: {}", id);
        try {
            UserDTO userDTO = userService.updateUserProfile(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "User profile updated successfully", userDTO));
        } catch (Exception e) {
            log.error("Update user error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/profile/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getMyProfile() {
        log.info("Get my profile endpoint called");
        try {
            // This would need to extract the current user from SecurityContext
            return ResponseEntity.ok(new ApiResponse(true, "Profile retrieved successfully"));
        } catch (Exception e) {
            log.error("Get profile error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
