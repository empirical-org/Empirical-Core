# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_relevant_texts
#
#  id         :bigint           not null, primary key
#  notes      :text             default("")
#  text       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_relevant_text, class: 'Evidence::Research::GenAI::RelevantText' do
          text { 'This is the text' }
          notes { 'These are the notes' }
        end
      end
    end
  end
end
