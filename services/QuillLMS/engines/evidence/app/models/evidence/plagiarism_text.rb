# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_plagiarism_texts
#
#  id         :integer          not null, primary key
#  text       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  rule_id    :integer          not null
#
# Indexes
#
#  index_comprehension_plagiarism_texts_on_rule_id  (rule_id)
#
# Foreign Keys
#
#  fk_rails_...  (rule_id => comprehension_rules.id) ON DELETE => cascade
#
module Evidence
  class PlagiarismText < ApplicationRecord
    include TextFormatter

    self.table_name = 'comprehension_plagiarism_texts'

    default_scope { order(created_at: :asc) }

    include Evidence::ChangeLog

    belongs_to :rule, inverse_of: :plagiarism_texts

    validates_presence_of :rule
    validates :text, presence: true

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :rule_id, :text]
      ))
    end

    def change_log_name
      'Plagiarism Rule Text'
    end

    def url
      rule.url
    end

    def evidence_name
      rule.name
    end

    def conjunctions
      rule.prompts.map(&:conjunction)
    end

    def invalid_activity_ids
      related_passages = rule.prompts.map(&:activity).uniq.map(&:passages).flatten
      invalid_ids = related_passages.reject do |p|
        included = unscape_html_strip_tags_and_punctuation_and_downcase(p.text).include?(unscape_html_strip_tags_and_punctuation_and_downcase(text))
        if !included
          puts 'UNFORMATTED PASSAGE TEXT', p.text
          puts 'UNFORMATTED TEXT', text
          puts 'FORMATETTED PASSAGE TEXT', unscape_html_strip_tags_and_punctuation_and_downcase(p.text)
          puts 'FORMATTED TEXT', unscape_html_strip_tags_and_punctuation_and_downcase(text)
        end
        included
      end.map { |p| p.activity.id }
      return if invalid_ids.empty?

      invalid_ids
    end

  end
end
