# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_g_eval_scores
#
#  id             :bigint           not null, primary key
#  score          :integer          not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  g_eval_id      :integer          not null
#  llm_example_id :integer          not null
#  trial_id       :integer          not null
#
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
