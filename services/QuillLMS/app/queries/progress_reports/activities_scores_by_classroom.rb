# frozen_string_literal: true

class ProgressReports::ActivitiesScoresByClassroom
  # params:
  # => timezone: string | nil.
  #       Examples: "America/Chicago", 'Eastern Time (US & Canada)', nil
  def self.results(classroom_ids, timezone=nil)
    ids = classroom_ids.join(', ')
    result = RawSqlRunner.execute(query(ids)).to_a
    transform_timestamps!(result, timezone)
    result
  end

  # Example argument string format: 'YYYY-MM-DD HH:MM:SS'
  # params:
  # => timezone: string | nil.
  #       Examples: "America/Chicago", 'Eastern Time (US & Canada)', nil
  def self.transform_timestamps!(data, timezone)
    data.each_index do |i|
      if timezone
        begin
          data[i]['last_active'] = DateTime.strptime(
            data[i]['last_active'], '%Y-%m-%d %H:%M:%S'
          ).in_time_zone(timezone).strftime('%Y-%m-%d %H:%M:%S')
        rescue ArgumentError, TypeError, NoMethodError => e
          # no-op error handling, fails silently
        end
      end
    end
  end

  def self.query(classroom_ids)
    <<~SQL
      SELECT classrooms.name AS classroom_name,
        students.id AS student_id,students.last_active,
        students.name,
        AVG(activity_sessions.percentage)
        FILTER (
          WHERE activity_classifications.scored = true
        ) AS average_score,
        COUNT(activity_sessions.id) AS activity_count,
        SUM(activity_sessions.timespent) AS timespent,
        classrooms.id AS classroom_id
      FROM classroom_units
      JOIN activity_sessions
        ON classroom_units.id = activity_sessions.classroom_unit_id
      JOIN activities
        ON activity_sessions.activity_id = activities.id
      JOIN classrooms
        ON classrooms.id = classroom_units.classroom_id
      JOIN users AS students
        ON students.id = activity_sessions.user_id
      JOIN activity_classifications
        ON activities.activity_classification_id = activity_classifications.id
      WHERE classroom_units.classroom_id IN (#{classroom_ids})
      AND activity_sessions.is_final_score = TRUE
      AND activity_sessions.visible = true
      AND classroom_units.visible = true
      GROUP BY
        classrooms.name,
        students.id,
        students.name,
        classrooms.id,
        students.last_active
    SQL
  end
end
