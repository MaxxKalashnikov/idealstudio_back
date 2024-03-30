-- The function returns all available timeslots of 
-- an employee for the specified month of the year.
CREATE OR REPLACE FUNCTION GetAvailableTimeSlotsForMonth(
	employee_id_param INT,
    month_param INT,
    year_param INT
) RETURNS TABLE (
    timeslot_id INT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    employee_id INT
) AS $$
BEGIN
    -- Return available time slots of a specific employee for the specified month and year 
    RETURN QUERY
    SELECT ts.timeslot_id, ts.start_time, ts.end_time, ts.employee_id
    FROM timeslot ts
    WHERE EXTRACT(MONTH FROM ts.start_time) = month_param
        AND EXTRACT(YEAR FROM ts.start_time) = year_param
		AND ts.employee_id = employee_id_param
		AND ts.is_available = true;
END;
$$ LANGUAGE plpgsql;

-- valid function call example
SELECT * FROM GetAvailableTimeSlotsForMonth(1, 3, 2024);