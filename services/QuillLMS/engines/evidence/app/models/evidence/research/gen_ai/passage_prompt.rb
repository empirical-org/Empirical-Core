# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompts
#
#  id               :bigint           not null, primary key
#  conjunction      :string           not null
#  instructions     :text             not null
#  prompt           :text             not null
#  relevant_passage :text             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  activity_id      :integer          not null
#
module Evidence
  module Research
    module GenAI
      class PassagePrompt < ApplicationRecord
        CONJUNCTIONS = [
          BECAUSE = 'because',
          BUT = 'but',
          SO = 'so'
        ].freeze

        belongs_to :activity, class_name: 'Evidence::Research::GenAI::Activity'

        has_many :trials, dependent: :destroy
        has_many :passage_prompt_responses, class_name: 'Evidence::Research::GenAI::PassagePromptResponse', dependent: :destroy
        has_many :example_feedbacks, class_name: 'Evidence::Research::GenAI::ExampleFeedback', through: :passage_prompt_responses

        validates :prompt, presence: true
        validates :conjunction, presence: true, inclusion: { in: CONJUNCTIONS }
        validates :instructions, presence: true
        validates :relevant_passage, presence: true
        validates :activity_id, presence: true

        attr_readonly :prompt, :conjunction, :instructions, :activity_id, :relevant_passage

        delegate :name, to: :activity

        def to_s = "#{name} - #{conjunction}"
      end
    end
  end
end
