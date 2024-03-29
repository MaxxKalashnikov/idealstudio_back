-- user_account
CREATE TABLE user_account(
	user_account_id SERIAL PRIMARY KEY,
	user_type VARCHAR(20) NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	profile_picture_url VARCHAR(2048)
);

-- employee: The employee needs to have a user_account first
CREATE TABLE employee(
	employee_id SERIAL PRIMARY KEY,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	employee_type varchar(20) NOT NULL,
	specialization VARCHAR(20) NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT true,
	user_account_id INT NOT NULL REFERENCES user_account(user_account_id),
	CONSTRAINT valid_email CHECK (email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~ '^[0-9]{10}$')
);

-- customer
CREATE TABLE customer(
	customer_id SERIAL PRIMARY KEY,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	phone VARCHAR(20),
	user_account_id INT REFERENCES user_account(user_account_id),
	CONSTRAINT valid_email CHECK (email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~ '^[0-9]{10}$') -- 10 digit phone
);

-- service
CREATE TABLE service(
	service_id SERIAL PRIMARY KEY,
	service_name VARCHAR(255) NOT NULL,
	category VARCHAR(20) NOT NULL,
	description TEXT,
	price DECIMAL(5, 2) NOT NULL,
	is_available BOOLEAN NOT NULL
);

-- timeslot
CREATE TABLE timeslot (
    timeslot_id SERIAL PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
	is_vailable BOOLEAN NOT NULL DEFAULT true,
    employee_id INT NOT NULL REFERENCES employee(employee_id)
);

-- valid input
INSERT INTO timeslot (start_time, end_time, is_available, employee_id) 
VALUES ('2024-03-29 09:00:00', '2024-03-29 10:00:00', true, 1);


-- appointment
CREATE TABLE appointment (
    appointment_id SERIAL PRIMARY KEY,
	appointment_created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	description TEXT,
	is_canceled BOOLEAN NOT NULL DEFAULT false,
    customer_id INT NOT NULL REFERENCES customer(customer_id),
	service_id INT NOT NULL REFERENCES service(service_id),
	timeslot_id INT NOT NULL REFERENCES timeslot(timeslot_id)
);

-- review 
CREATE TABLE review(
	review_id SERIAL PRIMARY KEY,
	rating INT NOT NULL CHECK (rating >= 0 AND rating <= 5),
	comment TEXT,
	appointment_id INT NOT NULL REFERENCES appointment(appointment_id)
);

-- post --
CREATE TABLE post(
	post_id SERIAL PRIMARY KEY,
	content TEXT NOT NULL,
	post_created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	image_url VARCHAR(2048),
	author_id INT NOT NULL REFERENCES user_account(user_account_id)
);

-- post
CREATE TABLE reply(
	reply_id SERIAL PRIMARY KEY,
	content TEXT NOT NULL,
	reply_created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	author_id INT NOT NULL REFERENCES user_account(user_account_id),
	post_id INT NOT NULL REFERENCES post(post_id)
);