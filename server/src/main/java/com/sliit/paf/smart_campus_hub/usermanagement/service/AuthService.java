package com.sliit.paf.smart_campus_hub.usermanagement.service;

import com.sliit.paf.smart_campus_hub.usermanagement.dto.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse loginWithGoogle(String googleEmail, String googleId, String firstName, String lastName, String nic);
    void requestPasswordReset(ForgotPasswordRequest request);
    void resetPassword(PasswordResetRequest request);
}
