# frozen_string_literal: true

module Evidence
  class RuleHint < ApplicationRecord
    belongs_to :hint
    belongs_to :rule

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :hint_id, :rule_id]
      ))
    end
  end
end
