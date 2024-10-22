# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_activities
#
#  id           :bigint           not null, primary key
#  because_text :text             default(""), not null
#  but_text     :text             default(""), not null
#  name         :string           not null
#  so_text      :text             default(""), not null
#  text         :text             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
module Evidence
  module Research
    module GenAI
      class Activity < ApplicationRecord
        include TextFormatter

        has_many :stem_vaults, dependent: :destroy

        validates :name, presence: true
        validates :text, presence: true

        def to_s = name

        def invalid_relevant_text_keys
          relevant_texts.each_with_object([]) do |(key, value), invalid_keys|
            sentences = value.split(/(?<=[.!?])/).map(&:strip)
            invalid_keys << key if sentences.any? { |sentence| !stripped_passage.include?(strip_and_downcase(sentence)) }
          end.uniq
        end

        private def relevant_texts = { because_text:, but_text:, so_text: }

        private def strip_and_downcase(text) = unescape_html_strip_tags_and_punctuation_and_downcase(text)

        private def stripped_passage = @stripped_passage ||= strip_and_downcase(text)

      end
    end
  end
end
