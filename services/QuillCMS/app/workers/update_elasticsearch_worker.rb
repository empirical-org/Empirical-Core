class UpdateElasticsearchWorker
  include Sidekiq::Worker

  def perform
    # this is a periodic job that runs every day at 11:59 EST
    self.class.perform_at(Time.zone.tomorrow.end_of_day - 1.minute)

    responses = Response.where("updated_at >= ?", Time.zone.now.beginning_of_day)
    responses.each do |response|
      UpdateIndividualResponseWorker.perform_async(response.id)
    end
  end
end
