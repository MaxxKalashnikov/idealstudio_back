-- get the date of the last timeslot of an employee
CREATE OR REPLACE FUNCTION GetLastTimeslotDate(employee_id_param INT)
RETURNS DATE AS $$
DECLARE
    last_date DATE;
BEGIN
    SELECT MAX(DATE(end_time)) INTO last_date
    FROM timeslot
    WHERE employee_id = employee_id_param;

    RETURN last_date;
END;
$$ LANGUAGE plpgsql;