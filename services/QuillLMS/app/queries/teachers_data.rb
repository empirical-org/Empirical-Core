# frozen_string_literal: true

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
    return [] if teacher_ids.blank?

    teacher_ids_str = teacher_ids.join(', ')

    number_of_students_query = User.find_by_sql(
      "SELECT
        users.id,
        users.name,
        users.email,
        users.last_sign_in,
        COUNT(DISTINCT students_classrooms.id) AS number_of_students
      FROM users
      LEFT OUTER JOIN classrooms_teachers ON users.id = classrooms_teachers.user_id
      LEFT OUTER JOIN classrooms ON classrooms_teachers.classroom_id = classrooms.id AND classrooms.visible = true
      LEFT OUTER JOIN students_classrooms ON classrooms.id = students_classrooms.classroom_id AND students_classrooms.visible = true
      WHERE users.id IN (#{teacher_ids_str})
      GROUP BY users.id"
    )

    activities_count_query = User.find_by_sql(
      "SELECT
        users.id,
        COUNT(DISTINCT activity_sessions.id) AS number_of_activities_completed
      FROM users
      INNER JOIN units ON users.id = units.user_id
      INNER JOIN classroom_units ON units.id = classroom_units.unit_id
      INNER JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
      WHERE users.id IN (#{teacher_ids_str})
      AND activity_sessions.completed_at >= '#{last_july_first}'::date
      GROUP BY users.id"
    )

    time_spent_query = User.find_by_sql(
      "SELECT
        users.id,
        #{time_spent} AS time_spent
      FROM users
      INNER JOIN units ON users.id = units.user_id
      INNER JOIN classroom_units ON units.id = classroom_units.unit_id
      INNER JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
      WHERE users.id IN (#{teacher_ids_str})
      AND activity_sessions.completed_at >= '#{last_july_first}'::date
      GROUP BY users.id"
    )

    combiner = {}
    number_of_students_query.each do |row|
      combiner[row.id] = {
        name: row.name,
        email: row.email,
        school: row.school,
        number_of_students: row.number_of_students
      }
    end

    activities_count_query.each do |row|
      if combiner[row.id]
        combiner[row.id][:number_of_activities_completed] = row.number_of_activities_completed
      end
    end

    time_spent_query.each do |row|
      combiner[row.id][:time_spent] = row.time_spent
    end

    result = combiner.keys.map do |key|
      hash_value = combiner[key]
      user = User.new(
        id: key,
        name: hash_value[:name],
        email: hash_value[:email],
        school: hash_value[:school]
      )

      user.define_singleton_method(:number_of_students) do
        hash_value[:number_of_students]
      end

      user.define_singleton_method(:number_of_activities_completed) do
        hash_value[:number_of_activities_completed]
      end

      user.define_singleton_method(:time_spent) { hash_value[:time_spent] }

      user.define_singleton_method(:has_valid_subscription) { User.find_by_id(key).subscription_is_valid? }

      user
    end

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
      END)"
  end

  def self.last_july_first
    today = Date.current
    july_first_of_this_year = Date.parse("01-07-#{today.year}")
    today.month > 7 ? july_first_of_this_year : july_first_of_this_year - 1.year
  end
end
