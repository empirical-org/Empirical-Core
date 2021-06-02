class PopulateAllActivityHealthsWorker
  include Sidekiq::Worker

  def perform
    ActivityHealth.destroy_all
    # execute this command to start primary key indices back from 1
    ActiveRecord::Base.connection.execute("TRUNCATE activity_healths RESTART IDENTITY CASCADE")

    relevent_classifications = [
      ActivityClassification.find_by_key(ActivityClassification::CONNECT_KEY)&.id,
      ActivityClassification.find_by_key(ActivityClassification::GRAMMAR_KEY)&.id
    ]
    Activity.where(activity_classification_id: relevent_classifications).each do |act|
      PopulateActivityHealthWorker.perform_async(act.id)
    end
  end
end
