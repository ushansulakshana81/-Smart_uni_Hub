package com.sliit.paf.smart_campus_hub.usermanagement.controller;

import com.sliit.paf.smart_campus_hub.usermanagement.dto.*;
import com.sliit.paf.smart_campus_hub.usermanagement.service.AuthService;
import com.sliit.paf.smart_campus_hub.usermanagement.service.OtpService;
import com.sliit.paf.smart_campus_hub.exception.UnauthorizedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register endpoint called");
        try {
            AuthResponse authResponse = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "User registered successfully", authResponse));
        } catch (Exception e) {
            log.error("Registration error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login endpoint called for email: {}", request.getEmail());
        try {
            AuthResponse authResponse = authService.login(request);
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", authResponse));
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/google-login")
    public ResponseEntity<ApiResponse> googleLogin(@RequestParam String googleEmail,
                                                     @RequestParam String googleId,
                                                     @RequestParam String firstName,
                                                     @RequestParam String lastName,
                                                     @RequestParam String nic) {
        log.info("Google login endpoint called for email: {}", googleEmail);
        try {
            AuthResponse authResponse = authService.loginWithGoogle(googleEmail, googleId, firstName, lastName, nic);
            return ResponseEntity.ok(new ApiResponse(true, "Google login successful", authResponse));
        } catch (IllegalArgumentException e) {
            log.error("Google login validation error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (UnauthorizedException e) {
            log.error("Google login unauthorized: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            log.error("Google login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Forgot password endpoint called for email: {}", request.getEmail());
        try {
            authService.requestPasswordReset(request);
            return ResponseEntity.ok(new ApiResponse(true, "OTP sent to your email"));
        } catch (Exception e) {
            log.error("Forgot password error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        log.info("Reset password endpoint called for email: {}", request.getEmail());
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok(new ApiResponse(true, "Password reset successfully"));
        } catch (Exception e) {
            log.error("Reset password error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        log.info("Verify OTP endpoint called for email: {}", request.getEmail());
        try {
            boolean verified = otpService.verifyOtp(request);
            if (!verified) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "OTP verification failed"));
            }
            return ResponseEntity.ok(new ApiResponse(true, "OTP verified successfully"));
        } catch (Exception e) {
            log.error("OTP verification error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
