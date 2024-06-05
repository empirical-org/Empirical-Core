# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_student_responses
#
#  id                :bigint           not null, primary key
#  text              :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  passage_prompt_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_student_response, class: 'Evidence::Research::GenAI::StudentResponse' do
          passage_prompt { association :evidence_research_gen_ai_passage_prompt }
          text { 'This is the response' }
        end
      end
    end
  end
end
