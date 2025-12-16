package com.example.backend.service;

import com.example.backend.dto.OrderDto;
import org.springframework.http.HttpEntity;

import java.util.List;

public interface OrderService {
HttpEntity<?> createOrder(List<OrderDto> dto, String token);
HttpEntity<?> getUserOrders(String token);
}

