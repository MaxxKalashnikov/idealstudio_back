
CREATE OR REPLACE FUNCTION GetLastTimeslotDatePerEmployee()
RETURNS TABLE (
    employee_id INT,
    firstname VARCHAR,
    lastname VARCHAR,
    timeslot_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.employee_id,
        e.firstname,
        e.lastname,
        MAX(t.timeslot_date) AS last_timeslot_date
    FROM 
        timeslot t
    INNER JOIN 
        employee e ON t.employee_id = e.employee_id
    GROUP BY 
        t.employee_id, 
        e.firstname, 
        e.lastname;
END;
$$ LANGUAGE plpgsql;