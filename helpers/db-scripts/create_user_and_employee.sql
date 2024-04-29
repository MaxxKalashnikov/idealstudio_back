CREATE OR REPLACE FUNCTION create_user_and_employee(
    username_param VARCHAR(255),
    password_param VARCHAR(255),
    firstname_param VARCHAR(255),
    lastname_param VARCHAR(255),
    email_param VARCHAR(255),
    phone_param VARCHAR(20),
    picture VARCHAR(2048),
    specialization_param EmployeeSpecializaion
)
RETURNS VOID 
LANGUAGE plpgsql
AS $$
DECLARE
    user_id INT;
BEGIN
	-- user account
    INSERT INTO user_account (user_type, username, password, profile_picture_url)
    VALUES ('employee', username_param, password_param, picture)
    RETURNING user_account_id INTO user_id;

    -- employee
    INSERT INTO employee (firstname, lastname, email, phone, specialization, user_account_id)
    VALUES (firstname_param, lastname_param, email_param, phone_param, specialization_param, user_id);
END;
$$;