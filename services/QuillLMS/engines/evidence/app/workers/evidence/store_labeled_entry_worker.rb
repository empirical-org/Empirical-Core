# frozen_string_literal: true

module Evidence
  class StoreLabeledEntryWorker
    include Evidence.sidekiq_module

    sidekiq_options queue: 'default'

    def perform(prompt_id, entry, label)
      prompt = Prompt.find(prompt_id)

      LabeledEntry.find_or_create_by!(prompt:, entry:, label:)
    end
  end
end
