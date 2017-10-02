module PusherCSVExportCompleted

  def self.run(current_user_id, csv_url)
    pusher_client = Pusher::Client.new(
        app_id: ENV['PUSHER_APP_ID'],
        key: ENV['PUSHER_KEY'],
        secret: ENV['PUSHER_SECRET'],
        encrypted: true
    )
    pusher_client.trigger(current_user_id.to_s, 'csv-export-completed', message: csv_url)
  end

end
