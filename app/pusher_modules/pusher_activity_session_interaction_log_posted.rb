module PusherActivitySessionInteractionLogPosted

  def self.run(teachers, activity_session, interaction_log_creation_time, current_question)
    pusher_client = Pusher::Client.new(
        app_id: ENV["PUSHER_APP_ID"],
        key: ENV["PUSHER_KEY"],
        secret: ENV["PUSHER_SECRET"],
        encrypted: true
    )

    student_id = activity_session.user_id.to_s
    current_time = interaction_log_creation_time
    activity_sess_id = activity_session.id

    for tid in teachers do
      student_obj_str = $redis.hget("TEACHER_OBJ_FOR_TEACHER_ID_#{tid}", student_id)
      if student_obj_str.nil?
        $redis.hset("TEACHER_OBJ_FOR_TEACHER_ID_#{tid}", student_id, {}.to_json)
        student_obj_str = $redis.hget("TEACHER_OBJ_FOR_TEACHER_ID_#{tid}", student_id)
      end
      student_obj = JSON.parse(student_obj_str)

      if student_obj["activity_sess_id"] == activity_sess_id and ((current_time - DateTime.parse(student_obj["last_interaction"])) *24*60).to_i <= 2
        # less than 2 minutes since last interaction log posted
        # add x SECONDS
        seconds_since_last_log = ((current_time - DateTime.parse(student_obj["last_interaction"]))*24*60*60).to_i
        student_obj["timespent_activity_session"] += seconds_since_last_log
        if student_obj["current_question"] == current_question
          student_obj["timespent_question"] += seconds_since_last_log
        else
          student_obj["current_question"] = current_question
          student_obj["timespent_question"] = 0
        end
      else
        student_obj["name"] = activity_session.user.name
        student_obj["activity_name"] = activity_session.activity.name
        student_obj["current_question"] = current_question
        student_obj["timespent_activity_session"] = ActiveRecord::Base.connection.execute(
          "SELECT timespent_activity_session(#{activity_sess_id})"
        )[0]['timespent_activity_session'].to_i
        student_obj["timespent_question"] = 0 # could be innaccurate at times, but rarely and performance is better
        student_obj["activity_sess_id"] = activity_sess_id
      end
      student_obj["last_interaction"] = current_time.to_s
      $redis.hset("TEACHER_OBJ_FOR_TEACHER_ID_#{tid}", student_id, student_obj.to_json)
      $redis.expire("TEACHER_OBJ_FOR_TEACHER_ID_#{tid}", 60*60)
      # format data as follows,
      # {"data":[{"name":"Joslin Waeko",
      #           "activity_name":"And (Starter)",
      #           "current_question":"-KRjF-lQ6hq-TqPQypuz",
      #           "timespent_activity_session":"501",
      #           "last_interaction":"2018-10-18 15:52:07.515624",
      #           "timespent_question":"16",
      #           "activity_sess_id":"34109609"}
      #         ]}
      # }
      data = []
      teacher_obj = $redis.hgetall("TEACHER_OBJ_FOR_TEACHER_ID_#{tid}")
      teacher_obj.keys.map do |k|
        student_obj = JSON.parse(teacher_obj[k])
        if student_obj["last_interaction"]
          last_interaction = ((DateTime.now - DateTime.parse(student_obj["last_interaction"]))*24*60*60).to_i
          if last_interaction < 60
            data << student_obj
          end
        end
      end
      pusher_client.trigger(tid.to_s, 'as-interaction-log-pushed', data: data )
    end
  end

end
