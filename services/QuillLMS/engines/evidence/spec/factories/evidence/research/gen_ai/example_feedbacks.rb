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
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_example_feedback, class: 'Evidence::Research::GenAI::ExampleFeedback' do
          passage_prompt_response { association :evidence_research_gen_ai_passage_prompt_response }
          text { 'This is the feedback' }
          label { 'Optimal_1' }
        end
      end
    end
  end
end
