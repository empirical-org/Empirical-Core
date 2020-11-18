class ProgressReports::ActivitiesScoresByClassroom
  class << self 
    def results(classroom_ids, utc_offset=0)
      ids = classroom_ids.join(', ')
      result = ActiveRecord::Base.connection.execute(query(ids)).to_a
      transform_timestamps(result, utc_offset)
    end

    def transform_timestamps(data, utc_offset)
      data.each_index {|i| data[i][:last_active] = Time.new(data[i][:last_active]) + (utc_offset.hours) }
      data
    end


    private

    def query(classroom_ids)
      <<~SQL
        SELECT classrooms.name AS classroom_name,
          students.id AS student_id,students.last_active,
          students.name,
          AVG(activity_sessions.percentage)
          FILTER(WHERE activities.activity_classification_id <> 6 AND activities.activity_classification_id <> 4) AS average_score,
          COUNT(activity_sessions.id) AS activity_count,
          classrooms.id AS classroom_id
        FROM classroom_units
        JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN activities ON activity_sessions.activity_id = activities.id
        JOIN classrooms ON classrooms.id = classroom_units.classroom_id
        JOIN users AS students ON students.id = activity_sessions.user_id
        WHERE classroom_units.classroom_id IN (#{classroom_ids})
        AND activity_sessions.is_final_score = TRUE
        AND classroom_units.visible = true
        GROUP BY classrooms.name, students.id, students.name, classrooms.id, students.last_active
      SQL
    end
  end
end
