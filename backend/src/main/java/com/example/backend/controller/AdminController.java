package com.example.backend.controller;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepo;
import com.example.backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    UserRepo userRepo;
    
    @Autowired
    RoleRepo roleRepo;
    

    @PostMapping("/assign-admin/{username}")
    public ResponseEntity<?> assignAdminRole(@PathVariable String username) {
        try {
            User user = userRepo.findByUsername(username).orElseThrow(() -> 
                new RuntimeException("User not found: " + username));

            List<Role> adminRoles = roleRepo.findByName("ROLE_ADMIN");
            Role adminRole;
            if (adminRoles.isEmpty()) {
                adminRole = new Role();
                adminRole.setName("ROLE_ADMIN");
                adminRole = roleRepo.save(adminRole);
            } else {
                adminRole = adminRoles.get(0);
            }

            List<Role> userRoles = user.getRoles();
            boolean hasAdminRole = userRoles.stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));
            
            if (!hasAdminRole) {
                userRoles.add(adminRole);
                userRepo.save(user);
                return ResponseEntity.ok(Map.of("message", "Admin role assigned successfully to " + username));
            } else {
                return ResponseEntity.ok(Map.of("message", "User already has admin role"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

