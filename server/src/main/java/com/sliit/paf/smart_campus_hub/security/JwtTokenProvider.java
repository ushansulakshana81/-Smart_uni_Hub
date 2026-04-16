package com.sliit.paf.smart_campus_hub.security;

import org.springframework.security.core.Authentication;

public interface JwtTokenProvider {
    String generateAccessToken(Authentication authentication);
    String generateAccessToken(String userId, String email);
    String generateRefreshToken(String userId);
    String getUserIdFromToken(String token);
    String getEmailFromToken(String token);
    boolean validateToken(String token);
}
