# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_quill_feedbacks
#
#  id                         :bigint           not null, primary key
#  data_partition             :string
#  label                      :string           not null
#  paraphrase                 :text
#  text                       :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  passage_prompt_response_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class QuillFeedback < ApplicationRecord
        include HasOptimalAndSubOptimal

        DATA_PARTITIONS = [
          PROMPT_ENGINEERING_DATA = 'prompt_engineering',
          FINE_TUNING_DATA = 'fine_tuning',
          TESTING_DATA = 'testing'
        ].freeze

        belongs_to :passage_prompt_response, class_name: 'Evidence::Research::GenAI::PassagePromptResponse'

        validates :text, presence: true
        validates :label, presence: true
        validates :passage_prompt_response_id, presence: true
        validates :data_partition, inclusion: { in: DATA_PARTITIONS }, allow_nil: true

        attr_readonly :text, :label, :passage_prompt_response_id

        delegate :response, to: :passage_prompt_response

        scope :testing_data, -> { where(data_partition: TESTING_DATA) }
        scope :fine_tuning_data, -> { where(data_partition: FINE_TUNING_DATA) }
        scope :prompt_engineering_data, -> { where(data_partition: PROMPT_ENGINEERING_DATA) }

        def response_and_feedback = { response:, feedback: text, optimal: optimal? }.to_json

        def to_s = text
      end
    end
  end
end
