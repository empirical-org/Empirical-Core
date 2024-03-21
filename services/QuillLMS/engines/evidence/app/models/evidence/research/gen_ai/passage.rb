# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passages
#
#  id         :bigint           not null, primary key
#  contents   :text             not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
module Evidence
  module Research
    module GenAI
      class Passage < ApplicationRecord
        has_many :passage_prompts,
          class_name: 'Evidence::Research::GenAI::PassagePrompt',
          dependent: :destroy

        validates :name, presence: true
        validates :contents, presence: true
      end
    end
  end
end
