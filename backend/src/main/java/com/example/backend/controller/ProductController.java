package com.example.backend.controller;


import com.example.backend.dto.ProductDto;
import com.example.backend.service.ProductService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {
@Autowired
    ProductService productService;
    @GetMapping()
    public HttpEntity<?> getProducts(){
    return productService.getAllProducts();
    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @PostMapping()
    public HttpEntity<?> saveProduct(@RequestBody ProductDto productDto){
return productService.saveProduct(productDto);
    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @PostMapping("/img")
    public String saveProductImg(@RequestParam MultipartFile file) throws IOException {
       String name= UUID.randomUUID()+file.getOriginalFilename();
        FileOutputStream fileOutputStream = new FileOutputStream("backend/files/img/"+name);
        fileOutputStream.write(file.getBytes());
        fileOutputStream.close();
        return name;
    }
    @GetMapping("/img")
    public void getImg(HttpServletResponse response,@RequestParam String name) throws IOException {
        FileInputStream fileInputStream=new FileInputStream("backend/" +
                "files/img/"+name);
        ServletOutputStream outputStream = response.getOutputStream();
        fileInputStream.transferTo(outputStream);
        fileInputStream.close();
        outputStream.close();
    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @DeleteMapping()
    public void deleteProduct(@RequestParam UUID id){
        productService.deleteProduct(id);
    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @PutMapping()
    public void editProduct(@RequestBody ProductDto productDto,@RequestParam UUID id){
        productService.editProduct(productDto,id);
    }
}
