--updates perosnal info at the home page
CREATE OR REPLACE FUNCTION update_employee_info(
    new_firstname VARCHAR,
    new_lastname VARCHAR,
    new_email VARCHAR,
    new_phone VARCHAR,
    id_worker INT
)
RETURNS VOID AS $$
BEGIN
    UPDATE employee 
    SET 
        firstname = new_firstname,
        lastname = new_lastname,
        email = new_email,
        phone = new_phone
    WHERE 
        employee_id = id_worker;
END;
$$ LANGUAGE plpgsql;
