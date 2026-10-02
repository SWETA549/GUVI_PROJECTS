package com.careernest.dto;

import com.careernest.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record StatusRequest(@NotNull ApplicationStatus status) {}
