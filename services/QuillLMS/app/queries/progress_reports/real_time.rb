class ProgressReports::RealTime
  def self.results(student_ids)
    if student_ids.empty?
      student_ids = [0] # cannot do where in () in pg
    end
    ids = student_ids.join(',')
    #real_time_student_ids_json = $redis.get("REAL_TIME_STUDENT_#{ids}")
    real_time_student_ids_json = nil 
    if real_time_student_ids_json.nil?
      cache_life = 60*60*24*10 # => 10 days
      real_time_student_ids_json = ActiveRecord::Base.connection.execute(query(ids)).to_json
      $redis.set("REAL_TIME_STUDENT_#{ids}", real_time_student_ids_json)
      $redis.expire("REAL_TIME_STUDENT_#{ids}", cache_life)
    end
    JSON.parse(real_time_student_ids_json)
  end

  private


  # name, activity_name, current_question, timespent_activity_session,
  # last_interaction, activity_sess_id
  def self.query(student_ids)
    <<~SQL
      SELECT name, activity_name, current_question, timespent_activity_session, last_interaction, timespent_question(activity_sess_id::int, current_question), activity_sess_id
      FROM (

      SELECT name, activity_name, asil.meta ->> 'current_question' as current_question, timespent_activity_session, last_interaction, activity_sess_id FROM
      (SELECT users.id as user_id, users.name as name, activities.id as activity_id, activities.name as activity_name, timespent_activity_session(activity_sessions.id), max(activity_session_interaction_logs.date) as last_interaction, max(activity_session_interaction_logs.id) as asil_id, activity_sessions.id as activity_sess_id
        FROM users
        join activity_sessions on activity_sessions.user_id = users.id
        join activity_session_interaction_logs on activity_sessions.id = activity_session_interaction_logs.activity_session_id
        join activities on activity_sessions.activity_id = activities.id

        where users.id in (#{student_ids})
        group by users.id, activity_sessions.id, activities.id	--group by user_id, activity_name, activity_sessions.id
        order by last_interaction) as tab
      JOIN activity_session_interaction_logs as asil on asil.id=asil_id
      WHERE current_timestamp - last_interaction  < interval '2 minutes'

      ) as tab2;
    SQL
  end
end
