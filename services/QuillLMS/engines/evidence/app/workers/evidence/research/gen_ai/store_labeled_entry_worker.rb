# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class StoreLabeledEntryWorker
        include Evidence.sidekiq_module

        sidekiq_options queue: 'default'

        def perform(entry, label, prompt_id)
          prompt = Prompt.find(prompt_id)

          labeled_entry = LabeledEntry.find_by(prompt:, entry:)
          labeled_entry ? labeled_entry.update(label:) : LabeledEntry.create!(prompt:, entry:, label:)
        end
      end
    end
  end
end
