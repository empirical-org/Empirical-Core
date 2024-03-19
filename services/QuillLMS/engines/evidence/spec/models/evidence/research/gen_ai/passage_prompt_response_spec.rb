# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompt_responses
#
#  id                :bigint           not null, primary key
#  response          :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  passage_prompt_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe PassagePromptResponse, type: :model do
        it { should belong_to(:passage_prompt)}
        it { should validate_presence_of(:response) }

        it { expect(build(:evidence_research_gen_ai_passage_prompt_response)).to be_valid }
      end
    end
  end
end
