package com.example.backend.service;

import com.example.backend.dto.UserDto;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepo;
import com.example.backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    JwtService jwtService;

    @Override
    public HttpEntity<?> saveUser(UserDto dto) {
        List<Role> roleUser = roleRepo.findByName("ROLE_USER");
        User save = userRepo.save(new User(dto.username(), passwordEncoder.encode(dto.password()),
                dto.firstName(), dto.lastName(), roleUser, true));

        String accessToken = jwtService.generateJwtToken(save);
        String refreshToken = jwtService.generateRefreshToken(save);

        return ResponseEntity.ok(Map.of(
                "access_token", accessToken,
                "refresh_token", refreshToken
        ));
    }

    @Override
    public ResponseEntity<?> getUser(String username, String password) {
        System.out.println(username);
        User user = userRepo.findByUsername(username).orElseThrow();
        // Manually verify password using the configured PasswordEncoder instead of AuthenticationManager
        if (!passwordEncoder.matches(password, user.getPassword())) {
            // Return 401 when password is wrong
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Bad credentials"));
        }
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
