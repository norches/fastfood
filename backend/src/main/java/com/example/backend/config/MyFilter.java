package com.example.backend.config;

import com.example.backend.repository.UserRepo;
import com.example.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Configuration
public class MyFilter extends OncePerRequestFilter {
    @Autowired
    UserRepo userRepo;
    @Autowired
    JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();


        System.out.println("MyFilter: " + method + " " + path);


        if (isPublicEndpoint(path, method)) {
            System.out.println("Public endpoint, skipping authentication");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String authorization = request.getHeader("Authorization");
            if (authorization != null && !authorization.isEmpty()) {
                String id = jwtService.extractToken(authorization);
                UserDetails user = userRepo.findById(UUID.fromString(id)).orElseThrow();
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities())
                );
                System.out.println("User authenticated: " + user.getUsername());
            }
        } catch (Exception e) {
            System.out.println("MyFilter error: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String path, String method) {
        if (path.startsWith("/api/products/img")) return true;
        if (path.equals("/api/products") && method.equals("GET")) return true;
        if (path.startsWith("/api/auth/")) return true;
        if (path.equals("/api/orders")) return true;
        if (path.startsWith("/api/admin/assign-admin")) return true;

        return false;
    }
}