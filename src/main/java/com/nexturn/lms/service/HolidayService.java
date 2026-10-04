package com.nexturn.lms.service;

import com.nexturn.lms.entity.Holiday;
import com.nexturn.lms.repository.HolidayRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class HolidayService {

    private final HolidayRepository repository;

    public HolidayService(HolidayRepository repository) {
        this.repository = repository;
    }

    public List<Holiday> getAll() {
        return repository.findAll();
    }

    public Holiday save(Holiday holiday) {
        return repository.save(holiday);
    }

    public boolean isHoliday(LocalDate date) {
        return repository.findAll()
                .stream()
                .anyMatch(h -> h.getHolidayDate().equals(date));
    }
}
