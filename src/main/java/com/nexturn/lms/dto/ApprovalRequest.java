package com.nexturn.lms.dto;

import jakarta.validation.constraints.NotNull;

public record ApprovalRequest(
        @NotNull Integer managerId,
        String comment) {}
