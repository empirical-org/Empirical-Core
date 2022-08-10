# frozen_string_literal: true

module Evidence
  class ActivitySeedDataWorker
    include Evidence.sidekiq_module
    sidekiq_options retry: 0

    EMAIL = 'synthetic-data-exports@quill.org'

    def perform(activity_id, nouns)
      csv_hash = Evidence::Synthetic::SeedDataGenerator.csvs_for_activity(activity_id: activity_id, nouns: nouns)

      activity = Evidence::Activity.find(activity_id)
      subject = "Seed Data Activity: #{activity_id} - #{activity.title}"

      Evidence.file_mailer.send_multiple_files(EMAIL, subject, csv_hash)
    end
  end
end
