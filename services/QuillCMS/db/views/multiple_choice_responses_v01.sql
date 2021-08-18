-- Note, this SQL uses an count > 10 to make the query more performant
-- Otherwise this wouldn't finish on production
SELECT
  responses_filtered.id,
  responses_filtered.uid,
  responses_filtered.parent_id,
  responses_filtered.parent_uid,
  responses_filtered.question_uid,
  responses_filtered.author,
  responses_filtered.text,
  responses_filtered.feedback,
  responses_filtered.count,
  responses_filtered.first_attempt_count,
  responses_filtered.child_count,
  responses_filtered.optimal,
  responses_filtered.weak,
  responses_filtered.concept_results,
  responses_filtered.created_at,
  responses_filtered.updated_at,
  responses_filtered.spelling_error
FROM (
  SELECT responses.*,
    rank() OVER (
      PARTITION BY question_uid
      ORDER BY COUNT DESC
    )
  FROM responses
  WHERE count > 10 AND (optimal IS NULL OR optimal = FALSE)
) responses_filtered WHERE RANK <= 2;
