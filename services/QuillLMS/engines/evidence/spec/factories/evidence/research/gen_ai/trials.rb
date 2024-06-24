# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trials
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  num_examples        :integer
#  results             :jsonb
#  status              :string           default("pending"), not null
#  trial_duration      :float
#  trial_errors        :text             default([]), not null, is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  llm_id              :integer          not null
#  llm_prompt_id       :integer          not null
#  stem_vault_id       :integer          not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_trial, class: 'Evidence::Research::GenAI::Trial' do
          status { Evidence::Research::GenAI::Trial::PENDING }
          llm { association :evidence_research_gen_ai_llm }
          llm_prompt { association :evidence_research_gen_ai_llm_prompt }
          stem_vault { association :evidence_research_gen_ai_stem_vault }
        end
      end
    end
  end
end
