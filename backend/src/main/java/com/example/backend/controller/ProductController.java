    package com.example.backend.controller;


    import com.example.backend.dto.ProductDto;
    import com.example.backend.service.ProductService;
    import jakarta.servlet.ServletOutputStream;
    import jakarta.servlet.http.HttpServletResponse;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.http.HttpEntity;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.util.StringUtils;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;

    import java.io.*;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;
    import java.nio.file.StandardCopyOption;
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

        @Value("${upload.dir:files/img}")
    private String uploadDir;

    @PostMapping("/img")
    public ResponseEntity<?> saveProductImg(@RequestParam MultipartFile file) throws IOException {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String original = StringUtils.cleanPath(file.getOriginalFilename());
            String name = UUID.randomUUID() + "_" + original;
            Path destination = uploadPath.resolve(name).normalize();

            if (!destination.startsWith(uploadPath)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file name");
            }

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, destination, StandardCopyOption.REPLACE_EXISTING);
            }

            return ResponseEntity.ok(name);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save file");
        }
    }

    @GetMapping("/img")
    public void getImg(HttpServletResponse response, @RequestParam String name) throws IOException {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = uploadPath.resolve(StringUtils.cleanPath(name)).normalize();

        if (!filePath.startsWith(uploadPath) || !Files.exists(filePath) || Files.isDirectory(filePath)) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) contentType = "application/octet-stream";
        response.setContentType(contentType);
        response.setHeader("Content-Disposition", "inline; filename=\"" + filePath.getFileName().toString() + "\"");

        try (InputStream in = Files.newInputStream(filePath);
             ServletOutputStream out = response.getOutputStream()) {
            in.transferTo(out);
            out.flush();
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
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
