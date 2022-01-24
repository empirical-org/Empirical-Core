module AdminUpdates

  def self.run(question_id)
    pusher_client = Pusher::Client.new(
        app_id: ENV['PUSHER_APP_ID'],
        key: ENV['PUSHER_KEY'],
        secret: ENV['PUSHER_SECRET'],
        encrypted: true
    )
    pusher_client.trigger("admin-#{question_id}", 'new-response', message: "time to reload!")
  end

end
