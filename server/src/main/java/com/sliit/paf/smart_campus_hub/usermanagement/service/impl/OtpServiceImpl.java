package com.sliit.paf.smart_campus_hub.usermanagement.service.impl;

import com.sliit.paf.smart_campus_hub.exception.InvalidOtpException;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.OtpVerificationRequest;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.OtpToken;
import com.sliit.paf.smart_campus_hub.usermanagement.repository.OtpTokenRepository;
import com.sliit.paf.smart_campus_hub.usermanagement.service.EmailService;
import com.sliit.paf.smart_campus_hub.usermanagement.service.OtpService;
import com.sliit.paf.smart_campus_hub.util.OtpGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final EmailService emailService;

    @Override
    public String generateAndSendOtp(String email) {
        log.info("Generating OTP for email: {}", email);
        
        String otp = OtpGenerator.generateOtp();
        
        // Delete any existing OTP for this email
        otpTokenRepository.deleteByEmail(email);
        
        // Save new OTP
        OtpToken otpToken = OtpToken.createNew(email, otp);
        otpTokenRepository.save(otpToken);
        
        // Send OTP via email
        emailService.sendOtpEmail(email, otp);
        
        log.info("OTP generated and sent to email: {}", email);
        return otp; // In production, don't return OTP to client
    }

    @Override
    public boolean verifyOtp(OtpVerificationRequest request) {
        log.info("Verifying OTP for email: {}", request.getEmail());
        
        OtpToken otpToken = otpTokenRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidOtpException("OTP not found for email: " + request.getEmail()));

        // Check if OTP is expired
        if (otpToken.isExpired()) {
            otpTokenRepository.delete(otpToken);
            throw new InvalidOtpException("OTP has expired");
        }

        // Check if max attempts reached
        if (otpToken.isMaxAttemptsReached()) {
            otpTokenRepository.delete(otpToken);
            throw new InvalidOtpException("Maximum OTP verification attempts exceeded");
        }

        // Verify OTP
        if (!otpToken.getOtp().equals(request.getOtp())) {
            otpToken.incrementAttempt();
            otpTokenRepository.save(otpToken);
            throw new InvalidOtpException("Invalid OTP");
        }

        // OTP verified successfully, delete the token
        otpTokenRepository.delete(otpToken);
        log.info("OTP verified successfully for email: {}", request.getEmail());
        return true;
    }

    @Override
    public void validateOtpForPasswordReset(String email, String otp) {
        log.info("Validating OTP for password reset for email: {}", email);
        verifyOtp(OtpVerificationRequest.builder()
                .email(email)
                .otp(otp)
                .build());
    }
}
