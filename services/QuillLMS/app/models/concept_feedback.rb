# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_feedbacks
#
#  id            :integer          not null, primary key
#  activity_type :string           not null
#  data          :jsonb
#  uid           :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_concept_feedbacks_on_activity_type          (activity_type)
#  index_concept_feedbacks_on_uid_and_activity_type  (uid,activity_type) UNIQUE
#
class ConceptFeedback < ApplicationRecord
  include Translatable

  TYPES = [
    TYPE_CONNECT = 'connect',
    TYPE_GRAMMAR = 'grammar'
  ]

  ALL_CONCEPT_FEEDBACKS_KEY = 'all_concept_feedbacks'

  validates :data, presence: true
  validates :uid, presence: true, uniqueness: { scope: :activity_type }
  validates :activity_type, presence: true, inclusion: {in: TYPES}
  validate :data_must_be_hash

  store_accessor :data, :description

  after_commit :clear_concept_feedbacks_cache

  def cache_key = "#{ALL_CONCEPT_FEEDBACKS_KEY}_#{activity_type}"

  def as_json(options = nil)
    translated_json(options || {})
  end

  def prompt
    <<~STRING
      can you translate the following phrase from english into latin american spanish for me? Please return just the translated text preserving (but not translating) the HTML. We are translating the instructions for an English-language grammar activity. The content of the activity itself is not translated. Therefore, please leave words that sound like they are part of the activity in the original english. Often they will between an HTML tag such as in <em>english word</em> or <ul>english word</ul>.
      Here is what I want translated:
    STRING
  end

  private def translatable_attribute = "description"

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash)
  end

  private def clear_concept_feedbacks_cache
    $redis.del(cache_key)
  end
end
