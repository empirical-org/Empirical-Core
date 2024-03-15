# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompt_response_exemplars
#
#  id                                  :bigint           not null, primary key
#  response                            :text             not null
#  created_at                          :datetime         not null
#  updated_at                          :datetime         not null
#  passage_prompt_response_feedback_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe PassagePromptResponseExemplar, type: :model do
        it { belong_to(:passage_prompt_response_feedback).class_name('Evidence::Research::GenAi::PassagePromptResponseFeedback') }
        it { should validate_presence_of(:response) }

        it { expect(build(:evidence_research_gen_ai_passage_prompt_response_exemplar)).to be_valid }
      end
    end
  end
end
