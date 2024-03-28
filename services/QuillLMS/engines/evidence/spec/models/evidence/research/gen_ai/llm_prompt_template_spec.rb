# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_templates
#
#  id          :bigint           not null, primary key
#  coda        :string           default("feedback"), not null
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
        it { should validate_presence_of(:description) }
        it { should validate_presence_of(:contents) }
        it { should validate_presence_of(:coda) }
        it { should validate_inclusion_of(:coda).in_array(LLMPromptTemplate::CODAS) }
        it { should have_readonly_attribute(:description) }
        it { should have_readonly_attribute(:contents) }
        it { should have_readonly_attribute(:coda) }

        it { should have_many(:llm_prompts).dependent(:destroy) }

        it { expect(FactoryBot.build(:evidence_research_gen_ai_llm_prompt_template)).to be_valid }
      end
    end
  end
end
