# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trials
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  num_examples        :integer          default(0), not null
#  results             :jsonb
#  status              :string           default("pending"), not null
#  trial_duration      :float
#  trial_errors        :text             default([]), not null, is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  llm_config_id       :integer          not null
#  llm_prompt_id       :integer          not null
#  passage_prompt_id   :integer          not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_trial, class: 'Evidence::Research::GenAI::Trial' do
          status { Evidence::Research::GenAI::Trial::PENDING }
          llm_config { association :evidence_research_gen_ai_llm_config }
          llm_prompt { association :evidence_research_gen_ai_llm_prompt }
          passage_prompt { association :evidence_research_gen_ai_passage_prompt }
        end
      end
    end
  end
end
