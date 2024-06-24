# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_student_responses
#
#  id            :bigint           not null, primary key
#  text          :text             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  stem_vault_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_student_response, class: 'Evidence::Research::GenAI::StudentResponse' do
          stem_vault { association :evidence_research_gen_ai_stem_vault }
          text { 'This is the response' }
        end
      end
    end
  end
end
