CREATE FUNCTION GenerateTimeSlots(
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
BEGIN
	-- loop through every day
	WHILE current_day <= end_date_param LOOP
		current_slot := start_time_param;
		-- loop throgh evey slot
		WHILE current_slot < end_time_param LOOP
			INSERT INTO timeslot (start_time, end_time, employee_id)
			VALUES (current_day + current_slot, 
				   current_day + (current_slot + INTERVAL '1 minute' * duration_minutes_param),
					employee_id_param);
			-- increment the current_time
			current_slot := current_slot + INTERVAL '1 minute' * duration_minutes_param;
		END LOOP;
		
		current_day := current_day + INTERVAL '1 day';
	END LOOP;
END;
$$ LANGUAGE plpgsql;
		
-- valid function call example			
select GenerateTimeSlots(1, 60, '09:00:00', '17:00:00', '2024-03-30', '2024-04-10');

					
					
