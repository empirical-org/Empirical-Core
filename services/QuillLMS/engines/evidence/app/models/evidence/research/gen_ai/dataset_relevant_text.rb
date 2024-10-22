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
      class DatasetRelevantText < ApplicationRecord
        belongs_to :dataset
        belongs_to :relevant_text

        validates :dataset_id, presence: true
        validates :relevant_text_id, presence: true

        attr_readonly :dataset_id, :relevant_text_id
      end
    end
  end
end
