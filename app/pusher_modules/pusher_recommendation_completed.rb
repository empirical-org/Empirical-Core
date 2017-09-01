module PusherRecommendationCompleted

  def self.run(classroom, unit_template_id, lesson)
    pusher_client = Pusher::Client.new(
        app_id: ENV["PUSHER_APP_ID"],
        key: ENV["PUSHER_KEY"],
        secret: ENV["PUSHER_SECRET"],
        encrypted: true
    )
    if lesson
      pusher_client.trigger(classroom.id.to_s, "#{unit_template_id}-lesson-assigned", message: "Unit Template #{unit_template_id} assigned to #{classroom.name}.")
    else
      pusher_client.trigger(classroom.id.to_s, 'personalized-recommendations-assigned', message: "Personalized recommendations assigned to #{classroom.name}.")
    end
  end

end
