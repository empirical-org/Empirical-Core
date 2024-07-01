# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_prompt_examples
#
#  id                    :bigint           not null, primary key
#  staff_assigned_status :string           not null
#  staff_feedback        :text
#  student_response      :text             not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  dataset_id            :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_prompt_example, class: 'Evidence::Research::GenAI::PromptExample' do
          student_response { 'This is the student response' }
          staff_assigned_status { TestExample::ASSIGNED_STATUSES.sample }
          staff_feedback { 'This is the human feedback' }
          dataset { association :evidence_research_gen_ai_dataset }

          trait(:optimal) { staff_assigned_status { HasAssignedStatus::OPTIMAL } }
          trait(:suboptimal) { staff_assigned_status { HasAssignedStatus::SUBOPTIMAL } }
        end
      end
    end
  end
end
