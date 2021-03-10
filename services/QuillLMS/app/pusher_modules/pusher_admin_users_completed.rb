module PusherAdminUsersCompleted

  def self.run(admin_id)
    pusher_client = Pusher::Client.new(
        app_id: ENV["PUSHER_APP_ID"],
        key: ENV["PUSHER_KEY"],
        secret: ENV["PUSHER_SECRET"],
        encrypted: true
    )
    # delay 2 seconds to prevent a race condition where
    # the front end hasn't set up Pusher receiver yet
    sleep(2)
    pusher_client.trigger(
      admin_id.to_s,
     "admin-users-found",
     message: "Admin users found for #{admin_id}."
   )
  end

end
