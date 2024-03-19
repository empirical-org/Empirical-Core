SELECT id, classroom_id, unit_id, ARRAY_LENGTH(assigned_student_ids) AS assigned_student_count FROM lms.classroom_units
