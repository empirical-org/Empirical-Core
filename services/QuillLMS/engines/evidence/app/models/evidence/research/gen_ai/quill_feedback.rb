# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_quill_feedbacks
#
#  id                  :bigint           not null, primary key
#  data_partition      :string
#  label               :string           not null
#  paraphrase          :text
#  text                :text             not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  student_response_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class QuillFeedback < ApplicationRecord
        include HasOptimalAndSuboptimal

        DATA_PARTITIONS = [
          PROMPT_ENGINEERING_DATA = 'prompt_engineering',
          FINE_TUNING_DATA = 'fine_tuning',
          TESTING_DATA = 'testing'
        ].freeze

        belongs_to :student_response

        validates :text, presence: true
        validates :label, presence: true
        validates :student_response_id, presence: true
        validates :data_partition, inclusion: { in: DATA_PARTITIONS }, allow_nil: true

        attr_readonly :text, :label, :student_response_id

        scope :testing_data, -> { where(data_partition: TESTING_DATA) }
        scope :fine_tuning_data, -> { where(data_partition: FINE_TUNING_DATA) }
        scope :prompt_engineering_data, -> { where(data_partition: PROMPT_ENGINEERING_DATA) }

        def response_and_feedback = { response: student_response.text, feedback: text, optimal: optimal? }.to_json

        def to_s = text
      end
    end
  end
end
