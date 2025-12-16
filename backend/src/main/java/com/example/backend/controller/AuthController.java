package com.example.backend.controller;

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
    @GetMapping("/login")
    public HttpEntity<?> checkUser(@RequestParam String username, @RequestParam String password) {
        System.out.println(username);
        System.out.println(password);
        HttpEntity<?> user = authService.getUser(username, password);
        System.out.println(user);
         return authService.getUser(username,password);
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
        System.out.println(authentication);
        return ResponseEntity.ok(authentication.getAuthorities());
    }
}
