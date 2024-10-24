# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trials
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  notes               :text
#  number              :integer          not null
#  results             :jsonb
#  status              :string           default("pending"), not null
#  temperature         :float            not null
#  trial_duration      :float
#  trial_errors        :text             default([]), not null, is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  dataset_id          :integer          not null
#  llm_id              :integer          not null
#  llm_prompt_id       :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_trial, class: 'Evidence::Research::GenAI::Trial' do
          status { Evidence::Research::GenAI::Trial::PENDING }
          llm { association :evidence_research_gen_ai_llm }
          llm_prompt { association :evidence_research_gen_ai_llm_prompt }
          dataset { association :evidence_research_gen_ai_dataset }
          temperature { 1.0 }
        end
      end
    end
  end
end
