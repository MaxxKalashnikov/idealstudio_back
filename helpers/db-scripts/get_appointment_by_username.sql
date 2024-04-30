CREATE OR REPLACE FUNCTION get_appointment_by_username(username_param TEXT)
RETURNS TABLE (
    appointment_id INTEGER,
    timeslot_date DATE,
    start_time TIME,
    end_time TIME,
    service_name TEXT,
    employee_firstname TEXT,
    employee_lastname TEXT,
    customer_firstname TEXT,
    customer_lastname TEXT,
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
        customer c ON a.customer_id = c.customer_id
    JOIN 
        user_account u ON e.user_account_id = u.user_account_id
    WHERE 
        u.username = username_param;
END;
$$ LANGUAGE plpgsql;
