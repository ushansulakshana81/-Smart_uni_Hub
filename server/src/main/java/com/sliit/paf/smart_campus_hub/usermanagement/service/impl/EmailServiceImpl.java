package com.sliit.paf.smart_campus_hub.usermanagement.service.impl;

import com.sliit.paf.smart_campus_hub.exception.EmailDeliveryException;
import com.sliit.paf.smart_campus_hub.usermanagement.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    @Value("${spring.mail.username:}")
    private String mailFromAddress;

    @Override
    public void sendOtpEmail(String email, String otp) {
        log.info("Sending OTP email to: {}", email);
        if (mailFromAddress == null || mailFromAddress.isBlank()) {
            throw new EmailDeliveryException("MAIL_USERNAME is not configured. Set SMTP credentials before sending OTP emails.");
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setFrom(mailFromAddress);
            message.setSubject("Password Reset - One Time Password (OTP)");
            message.setText("Your OTP for password reset is: " + otp + "\n\nThis OTP is valid for 2 minutes.\n\nIf you didn't request this, please ignore this email.");
            
            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", email, e);
            throw new EmailDeliveryException("Failed to send OTP email. Check SMTP credentials and Gmail app-password configuration.", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(String email, String resetLink) {
        log.info("Sending password reset email to: {}", email);
        if (mailFromAddress == null || mailFromAddress.isBlank()) {
            throw new EmailDeliveryException("MAIL_USERNAME is not configured. Set SMTP credentials before sending password reset emails.");
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setFrom(mailFromAddress);
            message.setSubject("Password Reset Successful");
            message.setText("Your password has been reset successfully.\n\nReset Link: " + resetLink + "\n\nIf you didn't request this, please contact our support team.");
            
            mailSender.send(message);
            log.info("Password reset email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", email, e);
            throw new EmailDeliveryException("Failed to send password reset email.", e);
        }
    }

    @Override
    public void sendAccountSuspendedEmail(String email) {
        log.info("Sending account suspended email to: {}", email);
        if (mailFromAddress == null || mailFromAddress.isBlank()) {
            throw new EmailDeliveryException("MAIL_USERNAME is not configured. Set SMTP credentials before sending account emails.");
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setFrom(mailFromAddress);
            message.setSubject("Your Account Has Been Suspended");
            message.setText("Your account on Smart Campus Hub has been suspended by an administrator.\n\nPlease contact support for more information.");
            
            mailSender.send(message);
            log.info("Account suspended email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send account suspended email to: {}", email, e);
            throw new EmailDeliveryException("Failed to send account suspended email.", e);
        }
    }

    @Override
    public void sendAccountDeletedEmail(String email) {
        log.info("Sending account deleted email to: {}", email);
        if (mailFromAddress == null || mailFromAddress.isBlank()) {
            throw new EmailDeliveryException("MAIL_USERNAME is not configured. Set SMTP credentials before sending account emails.");
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setFrom(mailFromAddress);
            message.setSubject("Your Account Has Been Deleted");
            message.setText("Your account on Smart Campus Hub has been deleted by an administrator.\n\nAll your data has been permanently removed.\n\nIf you believe this is a mistake, please contact our support team.");
            
            mailSender.send(message);
            log.info("Account deleted email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send account deleted email to: {}", email, e);
            throw new EmailDeliveryException("Failed to send account deleted email.", e);
        }
    }
}
