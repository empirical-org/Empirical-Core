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

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_example_prompt_response_feedback,
          class: 'Evidence::Research::GenAI::ExamplePromptResponseFeedback' do

          passage_prompt_response { association :evidence_research_gen_ai_passage_prompt_response }
          feedback { 'This is the feedback' }
          label { 'Optimal_1' }
        end
      end
    end
  end
end
