# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_experiments
#
#  id                :bigint           not null, primary key
#  results           :jsonb
#  status            :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  llm_config_id     :integer          not null
#  llm_prompt_id     :integer          not null
#  passage_prompt_id :integer          not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_experiment, class: 'Evidence::Research::GenAI::Experiment' do
          status { 'pending '}
          llm_config { association :evidence_research_gen_ai_llm_config }
          llm_prompt { association :evidence_research_gen_ai_llm_prompt }
          passage_prompt { association :evidence_research_gen_ai_passage_prompt }
        end
      end
    end
  end
end
