module Evidence
  class PromptsRule < ApplicationRecord
    self.table_name = 'comprehension_prompts_rules'

    belongs_to :prompt
    belongs_to :rule

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :prompt_id, :rule_id]
      ))
    end
  end
end
