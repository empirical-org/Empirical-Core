class ProgressReports::ActivitiesScoresByClassroom
  class << self 
    # params:
    # => timezone: string | nil. 
    #       Examples: "America/Chicago", 'Eastern Time (US & Canada)', nil
    def results(classroom_ids, timezone=nil)
      ids = classroom_ids.join(', ')
      result = ActiveRecord::Base.connection.execute(query(ids)).to_a
      transform_timestamps!(result, timezone)
      result
    end

    # params:
    # => timezone: string | nil. 
    #       Examples: "America/Chicago", 'Eastern Time (US & Canada)', nil
    def transform_timestamps!(data, timezone)
      data.each_index do |i| 
        if timezone
          begin
            data[i]['last_active'] = DateTime.strptime(
              data[i]['last_active'], '%Y-%m-%d %H:%M:%S'
            ).in_time_zone(timezone).strftime('%Y-%m-%d %H:%M:%S')
          rescue => e 
            puts "parse error!"
            #TODO: clean up this exception handling
          end
        end
      end
    end

    # params:
    # => string: 'YYYY-MM-DD HH:MM:SS'
    # This method is used because Time#new and Time#utc does not parse required format correctly
    # def time_string_to_time(str)
    #   Time.new(*str.split('-').map(&:to_i))
    # end


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
