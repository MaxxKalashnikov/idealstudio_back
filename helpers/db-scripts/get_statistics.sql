--gets statistics fro home page
CREATE OR REPLACE FUNCTION get_statistics()
RETURNS TABLE (
    entity_name TEXT,
    count BIGINT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 'appointments' AS entity_name, COUNT(*) AS count FROM appointment
    UNION ALL
    SELECT 'employees' AS entity_name, COUNT(*) AS count FROM employee
    UNION ALL
    SELECT 'customers' AS entity_name, COUNT(*) AS count FROM customer
    UNION ALL
    SELECT 'reviews' AS entity_name, COUNT(*) AS count FROM review;
END;
$$ LANGUAGE plpgsql;
