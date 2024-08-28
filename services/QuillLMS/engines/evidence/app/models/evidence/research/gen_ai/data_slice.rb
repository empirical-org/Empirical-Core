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
      class DataSlice < ApplicationRecord
        belongs_to :parent_dataset, class_name: 'Evidence::Research::GenAI::Dataset'
        belongs_to :child_dataset, class_name: 'Evidence::Research::GenAI::Dataset'

        validates :parent_dataset, presence: true
        validates :child_dataset, presence: true

        attr_readonly :parent_dataset_id, :child_dataset_id
      end
    end
  end
end
