package com.sliit.paf.smart_campus_hub.usermanagement.service;

public interface EmailService {
    void sendOtpEmail(String email, String otp);
    void sendPasswordResetEmail(String email, String resetLink);
    void sendAccountSuspendedEmail(String email);
    void sendAccountDeletedEmail(String email);
}
