# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompts
#
#  id                         :bigint           not null, primary key
#  locked                     :boolean          not null
#  optimal_examples_count       :integer          not null
#  optimal_guidelines_count     :integer          not null
#  suboptimal_examples_count   :integer          not null
#  suboptimal_guidelines_count :integer          not null
#  prompt                     :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  llm_prompt_template_id     :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMPrompt, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should belong_to(:llm_prompt_template) }

        it { should validate_presence_of(:prompt) }
        it { should validate_presence_of(:llm_prompt_template_id) }
        it { should validate_presence_of(:optimal_guidelines_count) }
        it { should validate_presence_of(:suboptimal_guidelines_count) }
        it { should validate_presence_of(:num_prompt_examples) }
        it { should validate_presence_of(:suboptimal_examples_count) }

        it { should have_readonly_attribute(:prompt) }
        it { should have_readonly_attribute(:llm_prompt_template_id) }
        it { should have_readonly_attribute(:optimal_guidelines_count) }
        it { should have_readonly_attribute(:suboptimal_guidelines_count) }
        it { should have_readonly_attribute(:optimal_examples_count) }
        it { should have_readonly_attribute(:suboptimal_examples_count) }

        it { should have_many(:trials).dependent(:destroy) }
      end
    end
  end
end
