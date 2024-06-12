# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_templates
#
#  id          :bigint           not null, primary key
#  contents    :text             not null
#  description :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMPromptTemplate, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:description) }
        it { should validate_presence_of(:contents) }
        it { should have_readonly_attribute(:description) }
        it { should have_readonly_attribute(:contents) }

        it { should have_many(:llm_prompts).dependent(:destroy) }
      end
    end
  end
end
