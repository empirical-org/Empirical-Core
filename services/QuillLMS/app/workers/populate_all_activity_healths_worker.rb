class PopulateAllActivityHealthsWorker
  include Sidekiq::Worker
  RELEVENT_ACTIVITY_CLASSIFICATION_IDS = [2, 5]
  RELEVENT_FLAGS = ["production"]

  def perform
    ActivityHealth.destroy_all!
    Activity.where(flags: RELEVENT_FLAGS, activity_classification_id: RELEVENT_ACTIVITY_CLASSIFICATION_IDS).each do |act|
      PopulateActivityHealthWorker.perform_async(act.id)
    end
  end
end
