SELECT id, user_id, classroom_unit_id, timespent, completed_at
  FROM lms.activity_sessions
  WHERE visible = true
    AND completed_at IS NOT NULL
