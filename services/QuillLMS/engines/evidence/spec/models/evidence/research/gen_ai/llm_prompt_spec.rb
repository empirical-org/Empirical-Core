# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompts
#
#  id                     :bigint           not null, primary key
#  prompt                 :text             not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  llm_prompt_template_id :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMPrompt, type: :model do
        it { should validate_presence_of(:prompt) }
        it { should belong_to(:llm_prompt_template) }

        it { expect(build(:evidence_research_gen_ai_llm_prompt)).to be_valid }
      end
    end
  end
end
