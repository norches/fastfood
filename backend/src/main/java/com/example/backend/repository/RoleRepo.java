package com.example.backend.repository;

import com.example.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RoleRepo  extends JpaRepository<Role, UUID> {
List<Role> findByName(String roleName);
}
