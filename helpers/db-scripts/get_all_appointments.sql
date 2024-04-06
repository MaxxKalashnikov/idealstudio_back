--function simply returns all appointments
CREATE OR REPLACE FUNCTION get_appointment_details()
RETURNS TABLE (
    appointment_id INT,
    timeslot_date DATE,
    start_time TIME,
    end_time TIME,
    service_name VARCHAR(255),
    employee_firstname VARCHAR(255),
    employee_lastname VARCHAR(255),
    customer_firstname VARCHAR(255),
    customer_lastname VARCHAR(255),
    is_canceled BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.appointment_id,
        t.timeslot_date,
        t.start_time,
        t.end_time,
        s.service_name,
        e.firstname AS employee_firstname,
        e.lastname AS employee_lastname,
        c.firstname AS customer_firstname,
        c.lastname AS customer_lastname,
        a.is_canceled
    FROM 
        appointment a
    JOIN 
        timeslot t ON a.timeslot_id = t.timeslot_id
    JOIN 
        service s ON a.service_id = s.service_id
    JOIN 
        employee e ON t.employee_id = e.employee_id
    JOIN 
        customer c ON a.customer_id = c.customer_id;
END;
$$ LANGUAGE plpgsql;
