# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passages
#
#  id         :bigint           not null, primary key
#  contents   :text             not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_passage, class: 'Evidence::Research::GenAI::Passage' do
          name { 'Passage 1' }
          contents { 'This is the contents' }
        end
      end
    end
  end
end
