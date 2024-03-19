# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_response_feedbacks
#
#  id                         :bigint           not null, primary key
#  feedback                   :text             not null
#  label                      :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  passage_prompt_response_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMPromptResponseFeedback, type: :model do
        it { should validate_presence_of(:feedback) }
        it { should belong_to(:passage_prompt_response).class_name('Evidence::Research::GenAI::PassagePromptResponse')}

        it { expect(build(:evidence_research_gen_ai_llm_prompt_response_feedback)).to be_valid}
      end
    end
  end
end
