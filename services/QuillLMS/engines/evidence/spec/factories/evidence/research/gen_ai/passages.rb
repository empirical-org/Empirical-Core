# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passages
#
#  id            :bigint           not null, primary key
#  abridged_text :text
#  full_text     :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_passage, class: 'Evidence::Research::GenAI::Passage' do
          full_text { 'This is the full text' }
          abridged_text { 'This is the abridged text' }
        end
      end
    end
  end
end
