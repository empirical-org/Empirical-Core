# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_g_evals
#
#  id                  :bigint           not null, primary key
#  evaluation_criteria :text             not null
#  evaluation_steps    :text             not null
#  max_score           :integer          not null
#  metric              :string           not null
#  misc                :jsonb
#  selectable          :boolean          default(TRUE)
#  task_introduction   :text             not null
#  version             :integer          not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

FactoryBot.define do
  factory :evidence_research_gen_ai_g_eval_score, class: 'Evidence::Research::GenAI::GEvalScore' do
    g_eval { association :evidence_research_gen_ai_g_eval }
    llm_example { association :evidence_research_gen_ai_llm_example }
    trial { association :evidence_research_gen_ai_trial }
    score { (1..5).to_a.sample }
  end
end
