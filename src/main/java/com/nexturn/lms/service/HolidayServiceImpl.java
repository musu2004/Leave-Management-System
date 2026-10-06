package com.nexturn.lms.service;

import com.nexturn.lms.entity.Holiday;
import com.nexturn.lms.repository.HolidayRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class HolidayServiceImpl implements HolidayService {

    private final HolidayRepository repository;

    public HolidayServiceImpl(HolidayRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Holiday> getAll() {
        return repository.findAll();
    }

    @Override
    public Holiday save(Holiday holiday) {
        return repository.save(holiday);
    }

    @Override
    public boolean isHoliday(LocalDate date) {
        return repository.findAll()
                .stream()
                .anyMatch(h -> h.getHolidayDate().equals(date));
    }
}