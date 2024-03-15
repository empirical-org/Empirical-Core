# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompts
#
#  id           :bigint           not null, primary key
#  conjunction  :string           not null
#  instructions :text             not null
#  prompt       :text             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  passage_id   :integer          not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_passage_prompt, class: 'Evidence::Research::GenAI::PassagePrompt' do
          prompt { "This is the prompt #{conjunction}" }
          passage { association :evidence_research_gen_ai_passage }
          conjunction { PassagePrompt::CONJUNCTIONS.sample }
          instructions { 'These are the instructions' }
        end
      end
    end
  end
end
