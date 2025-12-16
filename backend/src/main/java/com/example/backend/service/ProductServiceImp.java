package com.example.backend.service;

import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImp implements ProductService {
    @Autowired
    ProductRepo productRepo;
    @Override
    public HttpEntity<?> getAllProducts() {
        List<Product> all = productRepo.findAll();
        return ResponseEntity.ok(all);
    }

    @Override
    public HttpEntity<?> saveProduct(ProductDto dto) {
        Product save = productRepo.save(new Product(dto.name(), dto.description(), dto.price(), dto.image()));
        return ResponseEntity.ok(save);
    }

    @Override
    public void deleteProduct(UUID id) {
        productRepo.deleteById(id);
    }

    @Override
    public void editProduct(ProductDto dto, UUID id) {
        Product product = productRepo.findById(id).orElseThrow();
        product.setDescription(dto.description());
        product.setName(dto.name());
        product.setImage(dto.image());
        product.setPrice(dto.price());
        productRepo.save(product);
    }


}
