package com.example.backend.projection;

import com.fasterxml.jackson.annotation.JsonRawValue;

import java.util.UUID;

public interface OrderProjection {
    UUID getOrderId();
    UUID getUserId();
    String getFirstName();
    @JsonRawValue
    Object getOrders();
    Float getTotal();
}
