package com.example.backend.service;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class JwtServiceImp implements JwtService{

    @Override
    public String generateJwtToken(User user) {
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        Map<String, Object> claimMap = Map.of(
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "roles", roles
        );

        String token = Jwts.builder()
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15))
                .claims(claimMap)
                .signWith(secretKey())
                .subject(user.getId().toString())
                .compact();
        return token;
    }

    @Override
    public String generateRefreshToken(User user) {
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        Map<String, Object> claimMap = Map.of(
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "roles", roles
        );

        String token = Jwts.builder()
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7))
                .claims(claimMap)
                .signWith(secretKey())
                .subject(user.getId().toString())
                .compact();
        return token;
    }

    @Override
    public String extractToken(String token) {
        String subject = Jwts.parser().verifyWith(secretKey()).build().parseSignedClaims(token).getPayload().getSubject();
        return subject;
    }
    private SecretKey secretKey(){
        String secretKey = "w7Xrj3GcrfAJXJkStJ4qxC09iISB6YDfm0YNAg/ZTH4=";
        byte[] decode = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(decode);
    }
}
