# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompts
#
#  id               :bigint           not null, primary key
#  conjunction      :string           not null
#  instructions     :text             not null
#  prompt           :text             not null
#  relevant_passage :text             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  passage_id       :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe PassagePrompt, type: :model do
        it { should validate_presence_of(:prompt) }
        it { should validate_presence_of(:conjunction) }
        it { should validate_presence_of(:instructions) }
        it { should validate_presence_of(:relevant_passage) }
        it { should validate_presence_of(:passage_id) }
        it { should validate_inclusion_of(:conjunction).in_array(described_class::CONJUNCTIONS)}
        it { should have_readonly_attribute(:prompt) }
        it { should have_readonly_attribute(:conjunction) }
        it { should have_readonly_attribute(:instructions) }
        it { should have_readonly_attribute(:passage_id) }

        it { belong_to(:passage).class_name('Evidence::Research::GenAI::Passage') }

        it { have_many(:passage_prompt_responses).dependent(:destroy) }
        it { have_many(:example_feedbacks).through(:passage_prompt_responses) }
        it { have_many(:llm_feedbacks).through(:passage_prompt_responses) }
        it { have_many(:trials).dependent(:destroy) }

        it { expect(build(:evidence_research_gen_ai_passage_prompt)).to be_valid }
      end
    end
  end
end
