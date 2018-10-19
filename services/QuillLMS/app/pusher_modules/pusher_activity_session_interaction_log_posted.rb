module PusherActivitySessionInteractionLogPosted

  def self.run(teachers)
    pusher_client = Pusher::Client.new(
        app_id: ENV["PUSHER_APP_ID"],
        key: ENV["PUSHER_KEY"],
        secret: ENV["PUSHER_SECRET"],
        encrypted: true
    )
    # trigger(channel, event, data: data or data: {foo: bar} or {data:{foo:bar}})
    
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
