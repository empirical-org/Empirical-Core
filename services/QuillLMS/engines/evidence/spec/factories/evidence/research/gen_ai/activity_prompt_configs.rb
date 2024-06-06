# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_activity_prompt_configs
#
#  id                :bigint           not null, primary key
#  conjunction       :string           not null
#  optimal_rules     :text             not null
#  stem              :text             not null
#  sub_optimal_rules :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  activity_id       :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_activity_prompt_config, class: 'Evidence::Research::GenAI::ActivityPromptConfig' do
          stem { 'This is the stem' }
          activity { association :evidence_research_gen_ai_activity }
          conjunction { ActivityPromptConfig::CONJUNCTIONS.sample }
          optimal_rules { 'These are the optimal rules' }
          sub_optimal_rules { 'These are the sub-optimal rules' }
        end
      end
    end
  end
end
