-- Note, if you add or remove columns for the tables, you'll need a migration
-- To update this view use `rails generate scenic:view graded_responses`
-- See documentation here: https://github.com/scenic-views/scenic#cool-but-what-if-i-need-to-change-that-view
SELECT *
FROM responses
WHERE optimal IS NOT NULL;
