package com.careernest.dto;

public record AuthResponse(String token, String id, String name, String email, String phone, String role) {}
