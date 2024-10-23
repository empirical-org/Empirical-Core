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
        before_save :update_other_defaults, if: :will_save_change_to_default?

        private def update_other_defaults
          return unless default?

          scope = self.class.where(dataset_id:)
          scope = scope.where.not(id:) unless new_record?
          scope.update_all(default: false)
        end
      end
    end
  end
end
