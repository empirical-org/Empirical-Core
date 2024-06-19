# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_stem_vaults
#
#  id          :bigint           not null, primary key
#  conjunction :string           not null
#  stem        :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  activity_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class StemVault < ApplicationRecord
        CONJUNCTIONS = [
          BECAUSE = 'because',
          BUT = 'but',
          SO = 'so'
        ].freeze

        RELEVANT_TEXTS = {
          BECAUSE => :because_text,
          BUT => :but_text,
          SO => :so_text
        }.freeze

        belongs_to :activity, class_name: 'Evidence::Research::GenAI::Activity'

        has_many :trials, dependent: :destroy
        has_many :student_responses, class_name: 'Evidence::Research::GenAI::StudentResponse', dependent: :destroy
        has_many :quill_feedbacks, class_name: 'Evidence::Research::GenAI::QuillFeedback', through: :student_responses

        validates :stem, presence: true
        validates :conjunction, presence: true, inclusion: { in: CONJUNCTIONS }
        validates :activity_id, presence: true

        attr_readonly :stem, :conjunction, :activity_id

        delegate :name, :because_text, :but_text, :so_text, to: :activity

        def full_text = activity.text

        def relevant_text = send(RELEVANT_TEXTS[conjunction])

        def to_s = "#{name} - #{conjunction}"
      end
    end
  end
end
