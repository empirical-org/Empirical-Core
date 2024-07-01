# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trial_comparisons
#
#  id            :bigint           not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  comparison_id :integer          not null
#  trial_id      :integer          not null
#

module Evidence
  module Research
    module GenAI
      class TrialComparison < ApplicationRecord
        belongs_to :comparison
        belongs_to :trial

        validates :comparison_id, presence: true
        validates :trial_id, presence: true

        attr_readonly :comparison_id, :trial_id
      end
    end
  end
end
