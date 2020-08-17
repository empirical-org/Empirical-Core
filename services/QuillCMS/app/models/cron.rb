class Cron

  def self.run
    current_time = Time.now
    if current_time.hour == 23
      responses = Response.select(:id).where("updated_at >= ?", current_time.beginning_of_day)
      responses.each do |response|
        UpdateIndividualResponseWorker.perform_async(response.id)
      end
    end
  end
end
