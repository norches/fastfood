package com.example.backend.dto;

public record ProductDto(
        String name,
        String description,
        Float price,
        String image
) {
}
