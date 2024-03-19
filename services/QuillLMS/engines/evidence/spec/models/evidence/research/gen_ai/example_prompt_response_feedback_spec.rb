# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_example_prompt_response_feedbacks
#
#  id                         :bigint           not null, primary key
#  feedback                   :text             not null
#  label                      :string           not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  passage_prompt_response_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe ExamplePromptResponseFeedback, type: :model do
        it { should validate_presence_of(:feedback) }
        it { should validate_presence_of(:label) }

        it { should belong_to(:passage_prompt_response) }

        it { expect(build(:evidence_research_gen_ai_example_prompt_response_feedback)).to be_valid}
      end
    end
  end
end
