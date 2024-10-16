# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class StoreLabeledEntryWorker
        include Evidence.sidekiq_module

        sidekiq_options queue: 'default'

        def perform(entry, label, prompt_id)
          prompt = Prompt.find(prompt_id)

          LabeledEntry.find_or_create_by!(prompt:, entry:, label:)
        end
      end
    end
  end
end
