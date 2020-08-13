class UpdateElasticsearchWorker
  include Sidekiq::Worker

  def perform
    # this is a periodic job that runs every day at midnight UTC
    self.class.perform_at(Date.tomorrow.midnight)

    responses = Response.where("updated_at >= ?", Date.today)
    responses.each do |response|
      UpdateIndividualResponseWorker.perform_async(response.id)
    end
  end
end