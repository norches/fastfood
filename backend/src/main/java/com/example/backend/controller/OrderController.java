package com.example.backend.controller;

import com.example.backend.dto.OrderDto;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
@Autowired
    OrderService orderService;
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
@GetMapping
    public HttpEntity<?> getUserOrders(@RequestHeader String authorization){
   return orderService.getUserOrders(authorization);
}

@PostMapping
    public HttpEntity<?> saveOrder(@RequestBody List<OrderDto> orderDto,@RequestHeader String authorization){
    return    orderService.createOrder(orderDto,authorization);
}
}
