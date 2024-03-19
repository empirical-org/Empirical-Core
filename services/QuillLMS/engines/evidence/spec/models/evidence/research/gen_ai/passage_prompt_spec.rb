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

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe PassagePrompt, type: :model do
        it { should validate_presence_of(:prompt) }
        it { should validate_presence_of(:conjunction) }
        it { should validate_inclusion_of(:conjunction).in_array(described_class::CONJUNCTIONS)}
        it { should validate_presence_of(:instructions) }

        it { belong_to(:passage).class_name('Evidence::Research::GenAI::Passage') }
        it { have_many(:passage_prompt_responses).class_name('Evidence::Research::GenAI::PassagePromptResponse') }

        it { expect(build(:evidence_research_gen_ai_passage_prompt)).to be_valid }
      end
    end
  end
end
