# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_prompts_rules
#
#  id         :integer          not null, primary key
#  prompt_id  :integer          not null
#  rule_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
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
