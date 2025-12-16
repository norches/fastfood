package com.example.backend.repository;

import com.example.backend.entity.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderProductRepo extends JpaRepository<OrderProduct, UUID> {
}
