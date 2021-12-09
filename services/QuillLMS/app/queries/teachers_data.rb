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

  UserStruct = Struct.new(:id, :name, :email, :number_of_students, :number_of_questions_completed, :time_spent) 

  def self.run(teacher_ids)
    return [] if teacher_ids.blank?

    teacher_ids_str = teacher_ids.join(', ')
    number_of_students = User.find_by_sql(
      "SELECT
        users.id,
        users.name,
        users.email,
        COUNT(DISTINCT students_classrooms.id) AS number_of_students
      FROM users
      LEFT OUTER JOIN classrooms_teachers ON users.id = classrooms_teachers.user_id
      LEFT OUTER JOIN classrooms ON classrooms_teachers.classroom_id = classrooms.id
      LEFT OUTER JOIN students_classrooms ON classrooms.id = students_classrooms.classroom_id
      WHERE users.id IN (#{teacher_ids_str})
      GROUP BY users.id"
    )
    number_of_questions_completed = User.find_by_sql(
      "SELECT 
        users.id,
        COUNT(DISTINCT concept_results.id) AS number_of_questions_completed
      FROM users 
      INNER JOIN units ON users.id = units.user_id
      INNER JOIN classroom_units ON units.id = classroom_units.unit_id
      INNER JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
      INNER JOIN concept_results ON activity_sessions.id = concept_results.activity_session_id
      WHERE users.id IN (#{teacher_ids_str})
      AND activity_sessions.state = 'finished'
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
      AND activity_sessions.state = 'finished'
      GROUP BY users.id"
    )

    combiner = {}
    number_of_students.each do |row|
      combiner[row.id] = {
        name: row.name,
        email: row.email, 
        number_of_students: row.number_of_students
      }
    end

    number_of_questions_completed.each do |row|
      combiner[row.id][:number_of_questions_completed] = row.number_of_questions_completed
    end

    time_spent_query.each do |row|
      combiner[row.id][:time_spent] = row.time_spent
    end
    
    result = combiner.keys.map do |key|
      hash_value = combiner[key]
      UserStruct.new(
        key,
        hash_value[:name],
        hash_value[:email],
        hash_value[:number_of_students],
        hash_value[:number_of_questions_completed],
        hash_value[:time_spent]
      )
    end

  end

  # def self.combine(ar_rows, property_symbol, combiner = {})
  #   ar_rows.each do |row|
  #     if !combiner[row.id]
  #       combiner[row.id] = {}
  #     end 

  #     combiner[row.id][property_symbol] = row.send(:property_symbol)

  #   end
  # end

  # why would timespent be null?
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
end
