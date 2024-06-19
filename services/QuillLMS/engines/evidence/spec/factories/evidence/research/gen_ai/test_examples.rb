# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_test_examples
#
#  id                    :bigint           not null, primary key
#  automl_feedback       :text
#  automl_status         :string
#  highlight             :text
#  staff_assigned_status :string           not null
#  staff_feedback        :text
#  student_response      :text             not null
#  topic_tag             :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  dataset_id            :integer          not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_test_example, class: 'Evidence::Research::GenAI::TestExample' do
          student_response { 'This is the student response' }
          staff_assigned_status { TestExample::STAFF_ASSIGNED_STATUSES.sample }
          staff_feedback { 'This is the human feedback' }
          dataset { association :evidence_research_gen_ai_dataset }
        end
      end
    end
  end
end
