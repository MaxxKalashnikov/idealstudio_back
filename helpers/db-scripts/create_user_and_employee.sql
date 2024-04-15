CREATE OR REPLACE FUNCTION create_user_and_employee(
    username_param VARCHAR(255),
    password_param VARCHAR(255),
    firstname_param VARCHAR(255),
    lastname_param VARCHAR(255),
    email_param VARCHAR(255),
    phone_param VARCHAR(20),
    employee_type_param VARCHAR(20),
    specialization_param VARCHAR(20)
)
RETURNS VOID 
LANGUAGE plpgsql
AS $$
DECLARE
    user_id INT;
BEGIN
	-- user account
    INSERT INTO user_account (user_type, username, password)
    VALUES ('employee', username_param, password_param)
    RETURNING user_account_id INTO user_id;

    -- employee
    INSERT INTO employee (firstname, lastname, email, phone, employee_type, specialization, user_account_id)
    VALUES (firstname_param, lastname_param, email_param, phone_param, employee_type_param, specialization_param, user_id);
END;
$$;