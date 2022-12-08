# frozen_string_literal: true

class PopulateAggregatedEvidenceActivityHealthsWorker
  include Sidekiq::Worker

  INTERVAL = 120 # 3 minutes

  def perform
    Evidence::ActivityHealth.destroy_all
    # execute this command to start primary key indices back from 1
    ActiveRecord::Base.connection.execute("TRUNCATE evidence_activity_healths RESTART IDENTITY CASCADE")

    evidence_activities = Evidence::Activity.all.reject { |a| a.flag == Flags::ARCHIVED.to_sym }
    # spread these, to cut down on DB resource contention.
    evidence_activities.pluck(:id).each.with_index do |id, index|
      PopulateEvidenceActivityHealthWorker.perform_in(index * INTERVAL, id)
    end
  end
end
