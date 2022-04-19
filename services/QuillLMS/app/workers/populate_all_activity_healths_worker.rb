# frozen_string_literal: true

class PopulateAllActivityHealthsWorker
  include Sidekiq::Worker

  INTERVAL = 180 # 3 minutes

  def perform
    ActivityHealth.destroy_all
    # execute this command to start primary key indices back from 1
    ActiveRecord::Base.connection.execute("TRUNCATE activity_healths RESTART IDENTITY CASCADE")

    activities = Activity
      .not_archived
      .where(activity_classification: ActivityClassification.connect_or_grammar)

    # spread these
    activities.each.with_index do |activity, index|
      PopulateActivityHealthWorker.perform_in(index * INTERVAL, activity.id)
    end
  end
end
