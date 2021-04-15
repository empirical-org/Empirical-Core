module TeachersData
  # AVERAGE_TIME_SPENT was gathered from below query on 1/4/2016
  # https://dataclips.heroku.com/tympuxntqzshpmngbnbivaectbqm-average-time-per-activity_session?autosave=true
  AVERAGE_TIME_SPENT = 441 # (seconds)  ie interval '7 minutes 21 seconds'

  # num_students
  # num_questions_completd
  # num_time_spent

  # use Outer Joins to account for the fact that some of the teachers shown in the admin dashboard
  # will have no classrooms, etc.

  def self.run(teacher_ids)
    teacher_ids_str = teacher_ids.join(', ')
    User.find_by_sql("SELECT
      users.id,
      users.name,
      users.email,
      COUNT(DISTINCT students_classrooms.id) AS number_of_students,
      time_spent_query.number_of_questions_completed AS number_of_questions_completed,
      MAX(time_spent_query.time_spent) AS time_spent
    FROM users
    LEFT OUTER JOIN classrooms_teachers ON users.id = classrooms_teachers.user_id
    LEFT OUTER JOIN classrooms ON classrooms_teachers.classroom_id = classrooms.id
    LEFT OUTER JOIN students_classrooms ON classrooms.id = students_classrooms.classroom_id
    LEFT OUTER JOIN (SELECT acss_ids.teacher_id, #{time_spent}) AS time_spent, SUM(acss_ids.number_of_questions_completed) AS number_of_questions_completed FROM activity_sessions
      INNER JOIN (SELECT users.id AS teacher_id, COUNT(DISTINCT concept_results.id) AS number_of_questions_completed, activity_sessions.id AS activity_session_id FROM users
      INNER JOIN units ON users.id = units.user_id
      INNER JOIN classroom_units ON units.id = classroom_units.unit_id
      INNER JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
      INNER JOIN concept_results ON activity_sessions.id = concept_results.activity_session_id
      WHERE users.id IN (#{teacher_ids_str})
      AND activity_sessions.state = 'finished'
      GROUP BY users.id, activity_sessions.id) AS acss_ids ON activity_sessions.id = acss_ids.activity_session_id
      GROUP BY acss_ids.teacher_id
    ) AS time_spent_query ON users.id = time_spent_query.teacher_id
    WHERE users.id IN (#{teacher_ids_str})
    GROUP BY users.id, number_of_questions_completed")
  end

  def self.time_spent
    "SUM (
      CASE
      WHEN (activity_sessions.timespent IS NOT NULL) THEN activity_sessions.timespent
      WHEN (activity_sessions.started_at IS NULL)
        OR (activity_sessions.completed_at IS NULL)
        OR (activity_sessions.completed_at - activity_sessions.started_at < interval '1 minute')
        OR (activity_sessions.completed_at - activity_sessions.started_at > interval '30 minutes')
      THEN #{AVERAGE_TIME_SPENT}
      ELSE
        EXTRACT (
          'epoch' FROM (activity_sessions.completed_at - activity_sessions.started_at)
        )
      END"
  end
end
