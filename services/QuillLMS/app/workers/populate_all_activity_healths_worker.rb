class PopulateAllActivityHealthsWorker
  include Sidekiq::Worker

  def perform
    Activity.where(flags: ["production"]).each do |act|
      PopulateActivityHealthWorker.perform(act.id)
    end
  end
end
