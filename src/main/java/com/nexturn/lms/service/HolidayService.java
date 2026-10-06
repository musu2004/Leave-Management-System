package com.nexturn.lms.service;

import com.nexturn.lms.entity.Holiday;
import java.time.LocalDate;
import java.util.List;

public interface HolidayService {
    List<Holiday> getAll();
    Holiday save(Holiday holiday);
    boolean isHoliday(LocalDate date);
}