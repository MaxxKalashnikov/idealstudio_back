CREATE OR REPLACE FUNCTION get_last_timeslot_date_per_employee()
RETURNS TABLE (
    timeslot_id INT,
    employee_id INT,
    firstname VARCHAR,
    lastname VARCHAR,
    last_timeslot_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.timeslot_id,
        t.employee_id,
        e.firstname,
        e.lastname,
        t.last_timeslot_date
    FROM 
        (
            SELECT 
    			timeslot.employee_id,
    			MAX(timeslot.timeslot_id) as timeslot_id,
    			MAX(timeslot.timeslot_date) as last_timeslot_date
			FROM 
    		timeslot 
	GROUP BY 
    	timeslot.employee_id
		) t
    INNER JOIN 
        employee e ON t.employee_id = e.employee_id;
END;
$$ LANGUAGE plpgsql;