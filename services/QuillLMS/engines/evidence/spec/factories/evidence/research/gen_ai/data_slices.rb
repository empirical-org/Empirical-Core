# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_data_slices
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  child_dataset_id  :integer          not null
#  parent_dataset_id :integer          not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_data_slice, class: 'Evidence::Research::GenAI::DataSlice' do
          parent_dataset { association :evidence_research_gen_ai_dataset }
          child_dataset { association :evidence_research_gen_ai_dataset }
        end
      end
    end
  end
end
