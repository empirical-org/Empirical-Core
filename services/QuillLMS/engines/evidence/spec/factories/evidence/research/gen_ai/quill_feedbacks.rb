# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_quill_feedbacks
#
#  id                  :bigint           not null, primary key
#  data_partition      :string
#  label               :string           not null
#  paraphrase          :text
#  text                :text             not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  student_response_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_quill_feedback, class: 'Evidence::Research::GenAI::QuillFeedback' do
          student_response { association :evidence_research_gen_ai_student_response }
          text { 'This is the feedback' }
          label { 'Optimal_1' }

          trait(:testing) { data_partition { QuillFeedback::TESTING_DATA } }
          trait(:fine_tuning) { data_partition { QuillFeedback::FINE_TUNING_DATA } }
          trait(:prompt_engineering) { data_partition { QuillFeedback::PROMPT_ENGINEERING_DATA } }
        end
      end
    end
  end
end
