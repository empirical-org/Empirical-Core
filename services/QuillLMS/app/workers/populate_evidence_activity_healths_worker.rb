# frozen_string_literal: true

class PopulateEvidenceActivityHealthsWorker
  include Sidekiq::Worker

  INTERVAL = 180 # 3 minutes

  def perform
    Evidence::ActivityHealth.destroy_all
    # execute this command to start primary key indices back from 1
    ActiveRecord::Base.connection.execute("TRUNCATE evidence_activity_healths RESTART IDENTITY CASCADE")

    # spread these, to cut down on DB resource contention.
    Evidence::Activity.all.each.with_index do |activity, index|
      PopulateEvidenceActivityHealthWorker.perform_in(index * INTERVAL, activity.id)
    end
  end
end
