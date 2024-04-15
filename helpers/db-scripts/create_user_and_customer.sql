CREATE OR REPLACE FUNCTION create_user_and_customer(
	username_param VARCHAR(255),
    password_param VARCHAR(255),
	firstname_param VARCHAR(255),
    lastname_param VARCHAR(255),
    email_param VARCHAR(255),
    phone_param VARCHAR(20)
)
RETURNS VOID AS
$$
DECLARE
	customer_id_v INT;
	user_id_v INT;
BEGIN
	-- check
	SELECT c.customer_id INTO customer_id_v
	FROM customer c
	WHERE c.email = email_param;
	
	-- create a user_account
	INSERT INTO user_account(user_type, username, password)
        VALUES ('customer', username_param, password_param)
        RETURNING user_account_id INTO user_id_v;
		
	-- if customer doesn't already exist
	IF customer_id_v IS NULL THEN 		
		INSERT INTO customer (firstname, lastname, email, phone, user_account_id)
        VALUES (firstname_param, lastname_param, email_param, phone_param, user_id_v);
		
	ElSE
		-- if customer doesn't exist
		UPDATE customer SET user_account_id=user_id_v where customer_id=customer_id_v;
		
	END IF;
END;
$$
LANGUAGE plpgsql;