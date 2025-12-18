package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "orders")
public class Order {
@Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    private User user;
    private Float totalPrice;
    private String location;
    @OneToMany
    private List<OrderProduct> orderProducts;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Order(User user, Float totalPrice, List<OrderProduct> orderProducts) {
        this.user = user;
        this.totalPrice = totalPrice;
        this.orderProducts = orderProducts;
    }

    public Order(User user, Float totalPrice, String location, List<OrderProduct> orderProducts) {
        this.user = user;
        this.totalPrice = totalPrice;
        this.location = location;
        this.orderProducts = orderProducts;
    }
}
