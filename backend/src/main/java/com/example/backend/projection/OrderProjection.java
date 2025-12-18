package com.example.backend.projection;

import com.fasterxml.jackson.annotation.JsonRawValue;

import java.time.LocalDateTime;
import java.util.UUID;

public interface OrderProjection {
    UUID getOrderId();
    UUID getUserId();
    String getFirstName();
    String getLastName();
    @JsonRawValue
    Object getOrders();
    Float getTotal();
    String getLocation();
    LocalDateTime getCreatedAt();
}
