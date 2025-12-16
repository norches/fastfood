package com.example.backend.service;

import com.example.backend.entity.User;

public interface JwtService {
    String generateJwtToken(User user);
    String generateRefreshToken(User user);
    String extractToken(String token);

}
