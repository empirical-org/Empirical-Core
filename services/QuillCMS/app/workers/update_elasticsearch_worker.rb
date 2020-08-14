class UpdateElasticsearchWorker
  include Sidekiq::Worker

  def perform(run_date)
    # this is a periodic job that runs every day at 11:59 EST
    # each time it runs, it schedules the next upcoming run of itself
    next_run_date = run_date + 1.day
    self.class.perform_at(next_run_date, next_run_date) unless scheduled?

    responses = Response.select(:id).where("updated_at >= ?", run_date.beginning_of_day)
    responses.each do |response|
      UpdateIndividualResponseWorker.perform_async(response.id)
    end

  end

  def scheduled?
    scheduled_workers[self.class.name]
  end

  private

  def scheduled_workers
    @scheduled_workers ||= Sidekiq::ScheduledSet.new.entries.each_with_object({}) do |item, hash|
      hash[item['class']] = true
    end
  end
end
