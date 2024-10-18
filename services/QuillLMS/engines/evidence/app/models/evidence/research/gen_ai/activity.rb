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

        def invalid_relevant_texts
          invalid_keys = []
          relevant_texts = {
            because_text: because_text,
            but_text: but_text,
            so_text: so_text
          }

          stripped_passage = unescape_html_strip_tags_and_punctuation_and_downcase(text)

          relevant_texts.each do |key, value|
            sentences = value.split(/(?<=[.!?])/).map(&:strip)
            sentences.each do |sentence|
              invalid_keys << key unless stripped_passage.include?(unescape_html_strip_tags_and_punctuation_and_downcase(sentence))
            end
          end

          invalid_keys.uniq
        end
      end
    end
  end
end
