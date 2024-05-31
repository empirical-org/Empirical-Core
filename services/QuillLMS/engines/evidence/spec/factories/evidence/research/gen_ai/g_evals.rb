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
  factory :evidence_research_gen_ai_g_eval, class: 'Evidence::Research::GenAI::GEval' do
    task_introduction { 'Sample Task Introduction' }
    evaluation_criteria { 'Sample Criteria' }
    evaluation_steps { 'Sample Steps' }
    metric { 'sample_metric' }
    max_score { 10 }
    selectable { true }
    version { 1 }
  end
end
