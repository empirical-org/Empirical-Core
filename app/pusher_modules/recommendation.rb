module PusherRecommendationCompleted

  def self.run(classroom)
    pusher_client = Pusher::Client.new(
        app_id: ENV['PUSHER_APP_ID'],
        key: ENV['PUSHER_KEY'],
        secret: ENV['PUSHER_SECRET'],
        encrypted: true
    )
    pusher_client.trigger(classroom.id.to_s, 'recommendations-assigned', message: "Recommendations assigned to #{classroom.name}.")
  end

end
