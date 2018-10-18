module PusherActivitySessionInteractionLogPosted

  def self.run(teachers)
    pusher_client = Pusher::Client.new(
        app_id: ENV["PUSHER_APP_ID"],
        key: ENV["PUSHER_KEY"],
        secret: ENV["PUSHER_SECRET"],
        encrypted: true
    )
    # trigger(channel, event, data: data or data: {foo: bar} or {data:{foo:bar}})

    # requires,
    #
    # teachers, activity session, current time, current question, student id
    #

    # find teachers
    #   for each teacher
    #     unless there is a teacher object for the teacher in redis
    #       add empty teacher object to redis
    #       
    #     unless there is a student object in the teacher object
    #       add empty student object to teacher object
    #  
    #     if teacher_obj.student_obj and student_obj.activity_sess_id = activity_session
    #       if current_time - student_obj.last_interaction <= '2 minute'::interval
    #         student_obj.timespent_activity_session += seconds(current_time - student_obj.last_interaction)
    #         if student_obj.current_question = question_id
    #           student_obj.time_spent_question += seconds(current_time - student_obj.last_interaction)
    #         else
    #           student_obj.current_question = question_id
    #           student_obj.time_spent_question = 0
    #     else
    #       student_object.name = FETCH FROM DB
    #       student_object.activity_name = FETCH FROM DB
    #       student_object.activity_sess_id = activity_session
    #       student_object.timespent_activity_session = FETCH FROM DB
    #       student_object.timespent_question = 0
    #       student_obj.current_question = question_id
    #     student_obj.last_interaction = current_time
    #
    
    
    for tid in teachers do
      teachers_students = $redis.get("STUDENT_IDS_FOR_TEACHER_#{tid}")
      if teachers_students.nil?
        cache_life = 60*10 #=> within x minutes of joining quill a student will be on real time dash
        teachers_students = ActiveRecord::Base.connection.execute(
          "SELECT students.id FROM users AS teacher
          JOIN classrooms_teachers AS ct ON ct.user_id = teacher.id
          JOIN classrooms ON classrooms.id = ct.classroom_id AND classrooms.visible = TRUE
          JOIN students_classrooms AS sc ON sc.classroom_id = ct.classroom_id
          JOIN users AS students ON students.id = sc.student_id
          WHERE teacher.id = #{tid}"
        ).to_a.map{|s| s['id']}.join(',')
        $redis.set("STUDENT_IDS_FOR_TEACHER_#{tid}", teachers_students)
        $redis.expire("STUDENT_IDS_FOR_TEACHER_#{tid}", cache_life)
      end
      data = ProgressReports::RealTime.results(teachers_students.split(','))
      pusher_client.trigger(tid.to_s, 'as-interaction-log-pushed', data: data )
    end
  end

end
