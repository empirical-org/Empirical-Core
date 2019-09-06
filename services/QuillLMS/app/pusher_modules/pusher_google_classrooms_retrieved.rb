module PusherGoogleClassroomsRetrieved

  def self.run(user_id)
    pusher_client = Pusher::Client.new(
        app_id: ENV["PUSHER_APP_ID"],
        key: ENV["PUSHER_KEY"],
        secret: ENV["PUSHER_SECRET"],
        encrypted: true
    )
    pusher_client.trigger(
      user_id.to_s,
     'google-classrooms-retrieved',
     message: "Google classrooms found for #{user_id}."
   )
  end

end
