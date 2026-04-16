package com.sliit.paf.smart_campus_hub.usermanagement.service.impl;

import com.sliit.paf.smart_campus_hub.exception.DuplicateEmailException;
import com.sliit.paf.smart_campus_hub.exception.InvalidOtpException;
import com.sliit.paf.smart_campus_hub.exception.ResourceNotFoundException;
import com.sliit.paf.smart_campus_hub.exception.UnauthorizedException;
import com.sliit.paf.smart_campus_hub.security.JwtTokenProvider;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.*;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.Role;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.User;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.UserStatus;
import com.sliit.paf.smart_campus_hub.usermanagement.repository.UserRepository;
import com.sliit.paf.smart_campus_hub.usermanagement.service.AuthService;
import com.sliit.paf.smart_campus_hub.usermanagement.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final OtpService otpService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered: " + request.getEmail());
        }

        if (userRepository.existsByNic(request.getNic())) {
            throw new IllegalArgumentException("NIC already registered: " + request.getNic());
        }

        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .nic(request.getNic())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .department(request.getDepartment())
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .emailVerified(false)
                .build();

        userRepository.save(user);
        log.info("User registered successfully with email: {}", request.getEmail());

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return mapToAuthResponse(user, accessToken, refreshToken);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt with email: {}", request.getEmail());

        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        // Check if user is suspended
        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Your account has been suspended");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // Update last login
        user.updateLastLogin();
        userRepository.save(user);

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        log.info("User login successful for email: {}", request.getEmail());
        return mapToAuthResponse(user, accessToken, refreshToken);
    }

    @Override
    public AuthResponse loginWithGoogle(String googleEmail, String googleId, String firstName, String lastName, String nic) {
        log.info("Google login attempt with email: {}", googleEmail);

        if (nic == null || nic.isBlank()) {
            throw new IllegalArgumentException("NIC is required for Google login");
        }

        Optional<User> nicOwner = userRepository.findByNic(nic);

        // Check if user exists by google ID
        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> {
                    // Check if user exists by email
                    return userRepository.findByEmail(googleEmail)
                            .orElseGet(() -> {
                                if (nicOwner.isPresent()) {
                                    throw new IllegalArgumentException("NIC already registered: " + nic);
                                }
                                // Create new user
                                User newUser = User.builder()
                                        .email(googleEmail)
                                        .nic(nic)
                                        .firstName(firstName)
                                        .lastName(lastName)
                                        .googleId(googleId)
                                        .googleEmail(googleEmail)
                                        .role(Role.USER)
                                        .status(UserStatus.ACTIVE)
                                        .emailVerified(true)
                                        .createdAt(LocalDateTime.now())
                                        .updatedAt(LocalDateTime.now())
                                        .build();
                                return userRepository.save(newUser);
                            });
                });

        if (nicOwner.isPresent() && !nicOwner.get().getId().equals(user.getId())) {
            throw new IllegalArgumentException("NIC already registered: " + nic);
        }

        if (user.getNic() == null || user.getNic().isBlank()) {
            user.setNic(nic);
        } else if (!user.getNic().equalsIgnoreCase(nic)) {
            throw new UnauthorizedException("Provided NIC does not match this account");
        }

        // Check if user is suspended
        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Your account has been suspended");
        }

        // Update Google ID if not set
        if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
            user.setGoogleEmail(googleEmail);
        }

        // Update last login
        user.updateLastLogin();
        userRepository.save(user);

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        log.info("Google login successful for email: {}", googleEmail);
        return mapToAuthResponse(user, accessToken, refreshToken);
    }

    @Override
    public void requestPasswordReset(ForgotPasswordRequest request) {
        log.info("Password reset requested for email: {}", request.getEmail());

        // Check if user exists
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        // Generate and send OTP
        otpService.generateAndSendOtp(request.getEmail());
        log.info("OTP sent for password reset for email: {}", request.getEmail());
    }

    @Override
    public void resetPassword(PasswordResetRequest request) {
        log.info("Resetting password for email: {}", request.getEmail());

        // Validate passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Validate OTP
        otpService.validateOtpForPasswordReset(request.getEmail(), request.getOtp());

        // Find user and update password
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("Password reset successfully for email: {}", request.getEmail());
    }

    private AuthResponse mapToAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .nic(user.getNic())
                .role(user.getRole())
                .status(user.getStatus())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();
    }
}
