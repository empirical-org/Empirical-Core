# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompts
#
#  id           :bigint           not null, primary key
#  conjunction  :string           not null
#  instructions :text             not null
#  prompt       :text             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  passage_id   :integer          not null
#
module Evidence
  module Research
    module GenAI
      class PassagePrompt < ApplicationRecord
        CONJUNCTIONS = [
          BECAUSE = 'because',
          BUT = 'but',
          SO = 'so'
        ].freeze

        belongs_to :passage, class_name: 'Evidence::Research::GenAI::Passage'

        validates :prompt, presence: true
        validates :conjunction, presence: true, inclusion: { in: CONJUNCTIONS }
        validates :instructions, presence: true
      end
    end
  end
end
