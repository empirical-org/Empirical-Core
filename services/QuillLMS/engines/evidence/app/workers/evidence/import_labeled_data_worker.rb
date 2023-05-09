# frozen_string_literal: true

module Evidence
  class ImportLabeledDataWorker
    include Evidence.sidekiq_module

    def perform(filename, prompt_id)
      uploader = Evidence.file_uploader.new
      uploader.retrieve_from_store!(filename)

      csv_array = CSV.parse(uploader.file.read, encoding: 'utf-8')

      PromptTextBatch.import_labeled_csv(prompt_id, csv_array)
    end
  end
end
