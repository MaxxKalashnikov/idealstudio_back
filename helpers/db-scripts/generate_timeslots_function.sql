CREATE OR REPLACE FUNCTION generate_timeSlots(
	employee_id_param INT,
	duration_minutes_param INT,
	start_time_param TIME,
	end_time_param TIME,
	start_date_param DATE,
	end_date_param DATE
) RETURNS VOID AS $$
DECLARE
	-- variables
	current_day DATE := start_date_param;
	current_slot TIME;
	last_timeslot_date DATE;
BEGIN
	-- check the last timeslot date 
	SELECT GetLastTimeslotDate(employee_id_param) INTO last_timeslot_date;
	IF last_timeslot_date IS NOT NULL AND (start_date_param < CURRENT_DATE OR start_date_param <= last_timeslot_date) THEN
    		RAISE EXCEPTION 'start_date_param must be greater than %', last_timeslot_date;
	END IF; 
	
	-- check start and end dates
	IF start_date_param > end_date_param THEN 
		RAISE EXCEPTION 'start_date_param must be less than end_date_param';
	END IF;
	
	-- check start and end dates
	IF start_time_param >= end_time_param THEN 
		RAISE EXCEPTION 'start_time_param must be less than end_time_param';
	END IF;

	-- loop through every day
	WHILE current_day <= end_date_param LOOP
		-- check if current_day is a weekday
		IF EXTRACT(ISODOW FROM current_day) BETWEEN 1 AND 5 THEN
			current_slot := start_time_param;
			-- loop throgh evey slot
			WHILE current_slot < end_time_param LOOP
				INSERT INTO timeslot (timeslot_date, start_time, end_time, employee_id)
				VALUES (current_day, 
						current_slot, 
						(current_slot + INTERVAL '1 minute' * duration_minutes_param), 
						employee_id_param);
				-- increment the current_time
				current_slot := current_slot + INTERVAL '1 minute' * duration_minutes_param;
			END LOOP;
		END IF;
		
		current_day := current_day + INTERVAL '1 day';
	END LOOP;
END;
$$ LANGUAGE plpgsql;