# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_example_feedbacks
#
#  id                         :bigint           not null, primary key
#  data_partition             :string
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

          trait(:testing) { data_partition { Evidence::Research::GenAI::ExampleFeedback::TESTING_DATA } }
          trait(:fine_tuning) { data_partition { Evidence::Research::GenAI::ExampleFeedback::FINE_TUNING_DATA } }
          trait(:prompt_engineering) { data_partition { Evidence::Research::GenAI::ExampleFeedback::PROMPT_ENGINEERING_DATA } }
        end
      end
    end
  end
end
