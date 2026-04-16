package com.sliit.paf.smart_campus_hub.usermanagement.service.impl;

import com.sliit.paf.smart_campus_hub.exception.ResourceNotFoundException;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.UserDTO;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.UserProfileUpdateRequest;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.Role;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.User;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.UserStatus;
import com.sliit.paf.smart_campus_hub.usermanagement.repository.UserRepository;
import com.sliit.paf.smart_campus_hub.usermanagement.service.UserService;
import com.sliit.paf.smart_campus_hub.usermanagement.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public UserDTO getUserById(String id) {
        log.info("Fetching user by ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return mapToDTO(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        log.info("Fetching user by email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToDTO(user);
    }

    @Override
    public UserDTO updateUserProfile(String userId, UserProfileUpdateRequest request) {
        log.info("Updating user profile for ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDepartment(request.getDepartment());
        user.setProfilePictureUrl(request.getProfilePictureUrl());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        log.info("User profile updated successfully for ID: {}", userId);
        return mapToDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void suspendUser(String userId) {
        log.info("Suspending user with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setStatus(UserStatus.SUSPENDED);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Send notification email
        emailService.sendAccountSuspendedEmail(user.getEmail());
        log.info("User suspended successfully with ID: {}", userId);
    }

    @Override
    public void unsuspendUser(String userId) {
        log.info("Unsuspending user with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setStatus(UserStatus.ACTIVE);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        log.info("User unsuspended successfully with ID: {}", userId);
    }

    @Override
    public void deleteUser(String userId) {
        log.info("Deleting user with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Send notification email before deletion
        emailService.sendAccountDeletedEmail(user.getEmail());

        userRepository.deleteById(userId);
        log.info("User deleted successfully with ID: {}", userId);
    }

    @Override
    public List<UserDTO> getAllAdmins() {
        log.info("Fetching all admins");
        return userRepository.findByRole(Role.ADMIN)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .department(user.getDepartment())
                .profilePictureUrl(user.getProfilePictureUrl())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}
