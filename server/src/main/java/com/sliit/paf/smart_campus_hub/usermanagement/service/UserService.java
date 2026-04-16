package com.sliit.paf.smart_campus_hub.usermanagement.service;

import com.sliit.paf.smart_campus_hub.usermanagement.dto.*;

import java.util.List;

public interface UserService {
    UserDTO getUserById(String id);
    UserDTO getUserByEmail(String email);
    UserDTO updateUserProfile(String userId, UserProfileUpdateRequest request);
    List<UserDTO> getAllUsers();
    void suspendUser(String userId);
    void unsuspendUser(String userId);
    void deleteUser(String userId);
    List<UserDTO> getAllAdmins();
}
