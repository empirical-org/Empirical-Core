# frozen_string_literal: true

module Evidence
  class SyntheticLabeledDataWorker
    include Evidence.sidekiq_module
    sidekiq_options retry: 0

    EMAIL = Evidence::Synthetic::EMAIL

    def perform(filename, activity_id)
      uploader = Evidence.file_uploader.new
      uploader.retrieve_from_store!(filename)

      csv_array = CSV.parse(uploader.file.read)

      activity = Evidence::Activity.find(activity_id)
      csv_hash = Evidence::Synthetic::LabeledDataGenerator.csvs_from_run(csv_array, filename)

      subject = "Evidence Labeled Synthetic Data: #{activity_id} - #{activity.title}"

      Evidence.file_mailer.send_multiple_files(EMAIL, subject, csv_hash).deliver_now!
    end
  end
end
