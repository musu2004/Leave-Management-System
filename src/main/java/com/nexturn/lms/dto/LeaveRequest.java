package com.nexturn.lms.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record LeaveRequest(
        @NotNull Integer empId,
        @NotNull Integer leaveTypeId,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotBlank @Size(max = 200) String reason) {}


