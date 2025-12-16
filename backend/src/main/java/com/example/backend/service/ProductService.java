package com.example.backend.service;

import com.example.backend.dto.ProductDto;
import org.springframework.http.HttpEntity;

import java.util.UUID;

public interface ProductService {
    HttpEntity<?> getAllProducts();
    HttpEntity<?> saveProduct(ProductDto dto);
    void deleteProduct(UUID id);
    void editProduct(ProductDto dto, UUID id);
}
