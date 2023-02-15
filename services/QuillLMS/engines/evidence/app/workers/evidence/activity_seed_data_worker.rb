# frozen_string_literal: true

module Evidence
  class ActivitySeedDataWorker
    include Evidence.sidekiq_module
    sidekiq_options retry: 0

    def perform(activity_id, nouns, label_configs, use_passage)
      csv_hash = Evidence::Synthetic::SeedDataGenerator.csvs_for_activity(
        activity_id: activity_id,
        nouns: nouns,
        label_configs: label_configs,
        use_passage: use_passage
      )

      activity = Evidence::Activity.find(activity_id)
      subject = "Evidence Seed Data: Activity #{activity_id} - #{activity.title}"

      Evidence.file_mailer.send_multiple_files(Evidence::Synthetic::EMAIL, subject, csv_hash).deliver_now!
    end
  end
end
