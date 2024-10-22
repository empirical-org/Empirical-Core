# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_dataset_relevant_texts
#
#  id               :bigint           not null, primary key
#  default          :boolean          default(FALSE)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  dataset_id       :integer          not null
#  relevant_text_id :integer          not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_dataset_relevant_text, class: 'Evidence::Research::GenAI::DatasetRelevantText' do
          text { 'This is the text' }
          notes { 'These are the notes' }
        end
      end
    end
  end
end
