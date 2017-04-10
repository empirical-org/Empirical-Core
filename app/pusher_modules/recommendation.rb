module PusherRecommendationCompleted

  def self.run(classroom)
    pusher_client = Pusher::Client.new(
        app_id: '325356',
        key: 'e8e2624f034662fa347d',
        secret: '74bbba418f6faa68bf87',
        encrypted: true
    )
    pusher_client.trigger(classroom.id.to_s, 'recommendations-assigned', message: "Recommendations assigned to #{classroom.name}.")
  end

end
