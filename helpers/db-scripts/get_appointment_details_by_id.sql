--views more details for chosen appointment
CREATE OR REPLACE FUNCTION get_appointment_details_by_id(input_appointment_id INT)
RETURNS TABLE (
    appointment_id INT,
    timeslot_date DATE,
    start_time TIME,
    end_time TIME,
    service_name VARCHAR(255),
    category VARCHAR(20),
    price DECIMAL(5, 2),
    employee_firstname VARCHAR(255),
    employee_lastname VARCHAR(255),
    employee_email VARCHAR(255),
    employee_phone VARCHAR(20),
    employee_specialization VARCHAR(20),
    customer_firstname VARCHAR(255),
    customer_lastname VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
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
        s.category,
        s.price,
        e.firstname AS employee_firstname,
        e.lastname AS employee_lastname,
        e.email AS employee_email,
        e.phone AS employee_phone,
        e.specialization AS employee_specialization,
        c.firstname AS customer_firstname,
        c.lastname AS customer_lastname,
        c.email AS customer_email,
        c.phone AS customer_phone,
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
    WHERE 
        a.appointment_id = input_appointment_id;
END;
$$ LANGUAGE plpgsql;
