package com.sliit.paf.smart_campus_hub.usermanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "otp_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpToken {
    @Id
    private String id;

    @Indexed
    private String email;

    private String otp;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    @Indexed
    private int attemptCount;

    private static final int MAX_ATTEMPTS = 3;
    private static final long EXPIRY_MINUTES = 2;

    public static OtpToken createNew(String email, String otp) {
        OtpToken token = new OtpToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiresAt(LocalDateTime.now().plusMinutes(EXPIRY_MINUTES));
        token.setAttemptCount(0);
        return token;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }

    public boolean isMaxAttemptsReached() {
        return this.attemptCount >= MAX_ATTEMPTS;
    }

    public void incrementAttempt() {
        this.attemptCount++;
    }
}
