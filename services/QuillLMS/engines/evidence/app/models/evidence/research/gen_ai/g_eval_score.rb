# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class GEvalScore < ApplicationRecord
        belongs_to :trial
        belongs_to :g_eval
        belongs_to :llm_example

        attr_readonly :trial_id, :g_eval_id, :llm_example_id, :score

        validates :trial_id, :g_eval_id, :llm_example_id, :score, presence: true
      end
    end
  end
end
