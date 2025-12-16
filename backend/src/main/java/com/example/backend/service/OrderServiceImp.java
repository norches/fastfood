package com.example.backend.service;

import com.example.backend.dto.OrderDto;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderProduct;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.projection.OrderProjection;
import com.example.backend.repository.OrderProductRepo;
import com.example.backend.repository.OrderRepo;
import com.example.backend.repository.ProductRepo;
import com.example.backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImp implements OrderService {
   @Autowired
   OrderRepo orderRepo;
    @Autowired
    UserRepo userRepo;
    @Autowired
    JwtService jwtService;
    @Autowired
    ProductRepo productRepo;
    @Autowired
    OrderProductRepo orderProductRepo;
    @Override
    public HttpEntity<?> createOrder(List<OrderDto> dto, String token) {
        String id = jwtService.extractToken(token);
        User user = userRepo.findById(UUID.fromString(id)).orElseThrow();
        Order order = new Order();
        order.setOrderProducts(collectOrderProducts(dto));
        order.setUser(user);
        order.setTotalPrice(calculateTotalSum(dto));
        orderRepo.save(order);
        return ResponseEntity.ok(order);
    }

    @Override
    public HttpEntity<?> getUserOrders(String token) {
        String id = jwtService.extractToken(token);
        List<OrderProjection> userOrders = orderRepo.getUserOrders(UUID.fromString(id));
        return ResponseEntity.ok(userOrders);
    }

    private Float calculateTotalSum(List<OrderDto> dto){
        Float sum = 0f;
        for (OrderDto orderDto : dto) {
            Product product = productRepo.findById(orderDto.productId()).orElseThrow();
            sum+=orderDto.quantity()*product.getPrice();
        }
    return sum;}

    private List<OrderProduct> collectOrderProducts(List<OrderDto> dto){
        List<OrderProduct> orderProducts = new ArrayList<>();
        for (OrderDto orderDto : dto) {
            Product product = productRepo.findById(orderDto.productId()).orElseThrow();
            orderProducts.add(new OrderProduct(product,orderDto.quantity()));
        }
       orderProductRepo.saveAll(orderProducts);
    return orderProducts;}
}
