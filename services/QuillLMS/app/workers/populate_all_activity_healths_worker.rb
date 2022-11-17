# frozen_string_literal: true

class PopulateAllActivityHealthsWorker
  include Sidekiq::Worker

  INTERVAL = 180 # 3 minutes

  def perform
    perform_on_connect_and_grammar_activities
    perform_on_evidence_activities
  end

  private def perform_on_connect_and_grammar_activities
    ActivityHealth.destroy_all
    # execute this command to start primary key indices back from 1
    ActiveRecord::Base.connection.execute("TRUNCATE activity_healths RESTART IDENTITY CASCADE")

    relevant_ids = ActivityClassification.connect_or_grammar.pluck(:id)

    activities = Activity
      .not_archived
      .where(activity_classification_id: relevant_ids)

    # spread these, to cut down on DB resource contention.
    activities.each.with_index do |activity, index|
      PopulateActivityHealthWorker.perform_in(index * INTERVAL, activity.id)
    end
  end

  private def perform_on_evidence_activities
    Evidence::ActivityHealth.destroy_all
    # execute this command to start primary key indices back from 1
    ActiveRecord::Base.connection.execute("TRUNCATE evidence_activity_healths RESTART IDENTITY CASCADE")

    activities = Evidence::Activity.all

    # spread these, to cut down on DB resource contention.
    activities.each.with_index do |activity, index|
      PopulateEvidenceActivityHealthWorker.perform_in(index * INTERVAL, activity.id)
    end
  end
end
