-- Note, if you add or remove columns for the tables, you'll need a migration
SELECT *
FROM responses
WHERE optimal IS NOT NULL;
