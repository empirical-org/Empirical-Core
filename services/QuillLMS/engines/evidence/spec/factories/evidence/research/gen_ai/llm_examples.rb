# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_examples
#
#  id                  :bigint           not null, primary key
#  label               :string
#  llm_assigned_status :string           not null
#  llm_feedback        :text             not null
#  raw_text            :text             not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  test_example_id     :integer          not null
#  trial_id            :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_llm_example, class: 'Evidence::Research::GenAI::LLMExample' do
          trial { association :evidence_research_gen_ai_trial }
          test_example { association :evidence_research_gen_ai_test_example }
          raw_text { { 'feedback' => 'This is the feedback' }.to_json }
          llm_feedback { 'This is the feedback' }
          llm_assigned_status { HasAssignedStatus::ASSIGNED_STATUSES.sample }

          trait(:optimal) { llm_assigned_status { HasAssignedStatus::OPTIMAL } }
          trait(:suboptimal) { llm_assigned_status { HasAssignedStatus::SUBOPTIMAL } }
        end
      end
    end
  end
end
