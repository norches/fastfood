package com.example.backend.service;

import com.example.backend.dto.UserDto;
import org.springframework.http.HttpEntity;

public interface AuthService {
    HttpEntity<?> saveUser(UserDto dto);
    HttpEntity<?> getUser(String username, String password);
    String refreshToken(String refreshToken);
}
