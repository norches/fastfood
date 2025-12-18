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

    import java.io.File;
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

        @PostMapping("/img")
        public String saveProductImg(@RequestParam MultipartFile file) throws IOException {
            String uploadDir = "files/img/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String name = UUID.randomUUID() + "_" + file.getOriginalFilename();
            File destinationFile = new File(uploadDir + name);
            file.transferTo(destinationFile);

            System.out.println("File saved to: " + destinationFile.getAbsolutePath());
            return name;
        }
        @GetMapping("/img")
        public void getImg(HttpServletResponse response, @RequestParam String name) throws IOException {
            String filePath = "files/img/" + name;
            File file = new File(filePath);

            if (!file.exists()) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            response.setContentType("image/jpeg");
            FileInputStream fileInputStream = new FileInputStream(file);
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
