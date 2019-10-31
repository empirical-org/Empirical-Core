module PusherActivitySessionInteractionLogPosted

  def self.run(teacher_ids)
    pusher_client = Pusher::Client.new(
        app_id: ENV["PUSHER_APP_ID"],
        key: ENV["PUSHER_KEY"],
        secret: ENV["PUSHER_SECRET"],
        encrypted: true
    )
    teacher_ids.each do |tid|
      pusher_client.trigger(tid.to_s, 'as-interaction-log-pushed', message: "Progress is happening.")
    end
  end

end
