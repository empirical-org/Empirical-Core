# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_example_feedbacks
#
#  id                         :bigint           not null, primary key
#  label                      :string           not null
#  paraphrase                 :text
#  text                       :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  passage_prompt_response_id :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe ExampleFeedback, type: :model do
        it { should validate_presence_of(:text) }
        it { should validate_presence_of(:label) }
        it { should validate_presence_of(:passage_prompt_response_id)}

        it { should have_readonly_attribute(:text) }
        it { should have_readonly_attribute(:label) }
        it { should have_readonly_attribute(:passage_prompt_response_id) }

        it { should belong_to(:passage_prompt_response) }

        it { expect(build(:evidence_research_gen_ai_example_feedback)).to be_valid}

        it_behaves_like 'a class with optimal and sub-optimal'
      end
    end
  end
end
