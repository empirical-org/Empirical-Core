module PusherActivitySessionInteractionLogPosted

  def self.run(teachers)
    pusher_client = Pusher::Client.new(
        app_id: ENV["PUSHER_APP_ID"],
        key: ENV["PUSHER_KEY"],
        secret: ENV["PUSHER_SECRET"],
        encrypted: true
    )
    # trigger(channel, event, data: data or data: {foo: bar} or {data:{foo:bar}})
    
    for teacher in teachers do
      student_ids = teacher.students.map(&:id)
      data = ProgressReports::RealTime.results(student_ids)
      pusher_client.trigger(teacher.id.to_s, 'as-interaction-log-pushed', data: data )
    end
  end

end
