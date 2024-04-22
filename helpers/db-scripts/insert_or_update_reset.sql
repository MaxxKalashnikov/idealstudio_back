CREATE OR REPLACE FUNCTION insert_or_update_reset(
    user_account_id_in INT, 
    reset_token_in VARCHAR(255), 
    token_expires_in BIGINT
)
RETURNS BIGINT
AS $$
DECLARE
    token_expires_out BIGINT;
BEGIN
    UPDATE reset 
    SET reset_token = reset_token_in, token_expires = token_expires_in 
    WHERE user_account_id = user_account_id_in
    RETURNING token_expires INTO token_expires_out;

    IF NOT FOUND THEN
        BEGIN
            INSERT INTO reset (user_account_id, reset_token, token_expires) 
            VALUES (user_account_id_in, reset_token_in, token_expires_in) 
            RETURNING token_expires INTO token_expires_out;
        EXCEPTION
            WHEN unique_violation THEN
                RAISE EXCEPTION 'Unable to insert or update reset record';
        END;
    END IF;

    RETURN token_expires_out;
END;
$$ LANGUAGE plpgsql;
