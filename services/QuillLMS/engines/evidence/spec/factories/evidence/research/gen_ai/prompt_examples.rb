# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_prompt_examples
#
#  id                           :bigint           not null, primary key
#  automl_label                 :text
#  automl_primary_feedback      :text
#  automl_secondary_feedback    :text
#  curriculum_assigned_status   :string           not null
#  curriculum_label             :string
#  curriculum_proposed_feedback :text
#  highlight                    :text
#  student_response             :text             not null
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  dataset_id                   :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_prompt_example, class: 'Evidence::Research::GenAI::PromptExample' do
          student_response { 'This is the student response' }
          curriculum_assigned_status { TestExample::ASSIGNED_STATUSES.sample }
          curriculum_proposed_feedback { 'This is the human feedback' }
          dataset { association :evidence_research_gen_ai_dataset }

          trait(:optimal) { curriculum_assigned_status { HasAssignedStatus::OPTIMAL } }
          trait(:suboptimal) { curriculum_assigned_status { HasAssignedStatus::SUBOPTIMAL } }
        end
      end
    end
  end
end
