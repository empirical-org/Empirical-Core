# frozen_string_literal: true

module PusherTrigger

  def self.run(channel, event, message)
    pusher_client = Pusher::Client.new(
      app_id: ENV["PUSHER_APP_ID"],
      key: ENV["PUSHER_KEY"],
      secret: ENV["PUSHER_SECRET"],
      encrypted: true
    )

    pusher_client.trigger(
      channel.to_s,
      event,
      message: message
     )
  end

end
