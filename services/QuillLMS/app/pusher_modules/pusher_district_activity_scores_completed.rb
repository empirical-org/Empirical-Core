# frozen_string_literal: true

module PusherDistrictActivityScoresCompleted

  def self.run(admin_id)
    pusher_client = Pusher::Client.new(
        app_id: ENV["PUSHER_APP_ID"],
        key: ENV["PUSHER_KEY"],
        secret: ENV["PUSHER_SECRET"],
        encrypted: true
    )
    pusher_client.trigger(
      admin_id.to_s,
     'district-activity-scores-found',
     message: "District activity scores found for #{admin_id}."
   )
  end

end
