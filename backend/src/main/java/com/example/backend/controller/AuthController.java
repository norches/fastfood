package com.example.backend.controller;

import com.example.backend.dto.LoginDto;
import com.example.backend.dto.UserDto;
import com.example.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthService authService;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {
        return authService.getUser(dto.username(), dto.password());
    }

    @PostMapping("/register")
    public HttpEntity<?> saveUser(@RequestBody UserDto dto){
    return   authService.saveUser(dto);
    }
    @GetMapping("/info")
    public String getInfo(){
        return "d";
    }
    @GetMapping("/refresh")
    public String updateAccessToken(@RequestHeader String refreshToken){
        String newAccessToken = authService.refreshToken(refreshToken);
        return newAccessToken;
    }

    @GetMapping("/me")
    public HttpEntity<?> getOneUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(authentication.getAuthorities());
    }
}
