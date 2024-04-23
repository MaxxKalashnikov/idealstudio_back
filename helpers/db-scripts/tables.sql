 -- the user_type can be admin, employee or customer
CREATE TYPE UserType AS ENUM ('admin','employee', 'customer');

-- user_account
CREATE TABLE user_account(
	user_account_id SERIAL PRIMARY KEY,
	user_type UserType NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	profile_picture_url VARCHAR(2048)
);

-- INSERT INTO user_account (user_type, username, password, profile_picture_url)
-- VALUES ('employee', 'jane_smith', '$2b$10$k1r2s.Jk4KjauJMPJ6Pk5eeNLNyyl3kc0XvumhcxmpIC9ncX9YNs6', NULL); 

-- INSERT INTO user_account (user_type, username, password, profile_picture_url)
-- VALUES ('customer', 'helmi_paskajarvi', '$2b$10$k1r2s.Jk4KjauJMPJ6Pk5eeNLNyyl3kc0XvumhcxmpIC9ncX9YNs6', NULL); 
--password is 0000 and tis one in the example is hashed

-- employee specialization
CREATE TYPE EmployeeSpecializaion AS ENUM ('pedicure', 'manicure', 'both');

-- employee: The employee needs to have a user_account first
CREATE TABLE employee(
	employee_id SERIAL PRIMARY KEY,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	specialization EmployeeSpecializaion NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT true,
	user_account_id INT UNIQUE NOT NULL REFERENCES user_account(user_account_id),
	CONSTRAINT valid_email CHECK (email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~ '^[0-9]{10}$')
);

-- INSERT INTO employee (firstname, lastname, email, phone, employee_type, specialization, is_active, user_account_id)
-- VALUES ('Jane', 'Smith', 'jane@example.com', '1234567890', 'master', 'nail-master', true, 4);

-- customer
CREATE TABLE customer(
	customer_id SERIAL PRIMARY KEY,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	phone VARCHAR(20) UNIQUE,
	user_account_id INT UNIQUE REFERENCES user_account(user_account_id) ON DELETE SET NULL,
	CONSTRAINT valid_email CHECK (email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~ '^[0-9]{10}$') -- 10 digit phone
);

-- INSERT INTO customer (firstname, lastname, email, phone, user_account_id)
-- VALUES ('Helmi', 'Pohjola', 'helmi@example.com', '1234567890', 5);


-- service
CREATE TABLE service(
	service_id SERIAL PRIMARY KEY,
	service_name VARCHAR(255) NOT NULL,
	category VARCHAR(20) NOT NULL,
	description TEXT,
	price DECIMAL(5, 2) NOT NULL,
	is_available BOOLEAN NOT NULL
);

-- firstly run this to set id counter back to 1:
-- ALTER SEQUENCE service_service_id_seq RESTART WITH 1;

-- secondly run this insert with correct information and prices
-- INSERT INTO service (service_name, category, description, price, is_available) VALUES
-- ('Hygienic manicure for women', 'manicure', 'A manicure specifically tailored for women, focusing on nail care and hygiene.', 25.00, true),
-- ('Hygienic manicure for men', 'manicure', 'A manicure designed for men, emphasizing nail care and hygiene.', 30.00, true),
-- ('Removal of old foreign coating', 'manicure', 'Service to remove any existing foreign coating from the nails.', 10.00, true),
-- ('Manicure + gel polish coating (short, medium nails)', 'manicure', 'Gel polish coating and alignment for short to medium length nails.', 50.00, true),
-- ('Manicure + gel polish coating (long nails)', 'manicure', 'A manicure service including gel polish coating and alignment specially for long nails.', 60.00, true),
-- ('Extension of four or more nails', 'manicure', 'Service to extend four or more nails using artificial materials.', 70.00, true),
-- ('Hygienic pedicure (treatment of toes and soles) for women', 'pedicure', 'A pedicure focused on womens feet, addressing toe and sole care along with hygiene.', 50.00, true),
-- ('Hygienic pedicure for women (treatment of toes and soles) + coating', 'pedicure', 'A pedicure service for women including treatment of toes and soles, along with the application of a coating.', 70.00, true),
-- ('Hygienic pedicure for men (treatment of toes and soles)', 'pedicure', 'A pedicure service specifically designed for men, focusing on toe and sole care and hygiene.', 70.00, true);



-- timeslot
CREATE TABLE timeslot (
    timeslot_id SERIAL PRIMARY KEY,
	timeslot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
	is_available BOOLEAN NOT NULL DEFAULT true,
    employee_id INT NOT NULL REFERENCES employee(employee_id),
	CONSTRAINT unique_timeslot UNIQUE (timeslot_date, start_time, end_time, employee_id),
	CONSTRAINT start_before_end CHECK (start_time < end_time)
);

-- valid input
-- INSERT INTO timeslot (start_time, end_time, is_available, employee_id) 
-- VALUES ('2024-03-29 09:00:00', '2024-03-29 10:00:00', true, 1);


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

-- INSERT INTO appointment (description, customer_id, service_id, timeslot_id)
-- VALUES ('Appointment for haircut', 1, 1, 1);

-- review 
CREATE TABLE review(
	review_id SERIAL PRIMARY KEY,
	rating INT NOT NULL CHECK (rating >= 0 AND rating <= 5),
	comment TEXT,
	appointment_id INT NOT NULL REFERENCES appointment(appointment_id) ON DELETE CASCADE
);

-- post --
CREATE TABLE post(
	post_id SERIAL PRIMARY KEY,
	content TEXT NOT NULL,
	title TEXT NOT NULL,
	post_created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	image_url VARCHAR(2048),
	author_id INT NOT NULL REFERENCES user_account(user_account_id)
);

-- post
CREATE TABLE reply(
	reply_id SERIAL PRIMARY KEY,
	content TEXT NOT NULL,
	reply_created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	author_id INT NOT NULL REFERENCES user_account(user_account_id) ON DELETE CASCADE,
	post_id INT NOT NULL REFERENCES post(post_id) ON DELETE CASCADE
);

--reset (for storing reset tokens and their expiration time)
CREATE TABLE password_reset(
	reset_id SERIAL PRIMARY KEY,
	user_account_id INT UNIQUE NOT NULL REFERENCES user_account(user_account_id) ON DELETE CASCADE,
	reset_token VARCHAR(255),
	token_expires bigint
);