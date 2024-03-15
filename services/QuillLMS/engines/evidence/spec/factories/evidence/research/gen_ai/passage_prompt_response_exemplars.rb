# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompt_response_exemplars
#
#  id                                  :bigint           not null, primary key
#  response                            :text             not null
#  created_at                          :datetime         not null
#  updated_at                          :datetime         not null
#  passage_prompt_response_feedback_id :integer          not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory(:evidence_research_gen_ai_passage_prompt_response_exemplar,
          class: 'Evidence::Research::GenAI::PassagePromptResponseExemplar') do

          response { 'This is the response' }
          passage_prompt_response_feedback { association :evidence_research_gen_ai_passage_prompt_response_feedback }
        end
      end
    end
  end
end
