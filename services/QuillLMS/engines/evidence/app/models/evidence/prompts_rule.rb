# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_prompts_rules
#
#  id         :integer          not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  prompt_id  :integer          not null
#  rule_id    :integer          not null
#
# Indexes
#
#  index_comprehension_prompts_rules_on_prompt_id_and_rule_id  (prompt_id,rule_id) UNIQUE
#  index_comprehension_prompts_rules_on_rule_id                (rule_id)
#
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
