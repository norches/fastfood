package com.example.backend.service;

import com.example.backend.dto.UserDto;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepo;
import com.example.backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthServiceImp implements AuthService {
    @Autowired
    UserRepo userRepo;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    RoleRepo roleRepo;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtService jwtService;

    @Override
    public HttpEntity<?> saveUser(UserDto dto) {
        List<Role> roleUser = roleRepo.findByName("ROLE_USER");
        System.out.println(roleUser);
        User save = userRepo.save(new User(dto.username(), passwordEncoder.encode(dto.password()),
                dto.firstName(), dto.lastName(), roleUser, true));
    return ResponseEntity.ok(save);
    }

    @Override
    public HttpEntity<?> getUser(String username, String password) {
        System.out.println(username);
        User user = userRepo.findByUsername(username).orElseThrow();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        String accessToken = jwtService.generateJwtToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return ResponseEntity.ok(Map.of("access_token",accessToken,"refresh_token",refreshToken));

    }

    @Override
    public String refreshToken(String refreshToken) {
        String id = jwtService.extractToken(refreshToken);
        User user = userRepo.findById(UUID.fromString(id)).orElseThrow();
        return jwtService.generateJwtToken(user);
    }
}
