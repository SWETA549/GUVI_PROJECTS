package com.careernest.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record JobRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String location,
        @NotBlank String salary,
        LocalDate deadline
) {}
