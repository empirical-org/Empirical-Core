# frozen_string_literal: true

#
# == Schema Information
#
# Table name: evidence_research_gen_ai_prompt_template_variables
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  value      :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_prompt_template_variable, class: 'Evidence::Research::GenAI::PromptTemplateVariable' do
          name { PromptTemplateVariable::NAMES.sample }
          value { Faker::Lorem.sentence }
        end
      end
    end
  end
end
