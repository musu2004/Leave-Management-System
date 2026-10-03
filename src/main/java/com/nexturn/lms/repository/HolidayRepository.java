package com.nexturn.lms.repository;

import com.nexturn.lms.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {

}

