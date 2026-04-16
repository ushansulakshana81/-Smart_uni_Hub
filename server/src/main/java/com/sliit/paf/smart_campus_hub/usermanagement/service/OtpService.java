package com.sliit.paf.smart_campus_hub.usermanagement.service;

import com.sliit.paf.smart_campus_hub.usermanagement.dto.OtpVerificationRequest;

public interface OtpService {
    String generateAndSendOtp(String email);
    boolean verifyOtp(OtpVerificationRequest request);
    void validateOtpForPasswordReset(String email, String otp);
}
