package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @OneToMany
    private List<OrderProduct> orderProducts;

    public Order(User user, Float totalPrice, List<OrderProduct> orderProducts) {
        this.user = user;
        this.totalPrice = totalPrice;
        this.orderProducts = orderProducts;
    }
}
