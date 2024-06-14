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
  TYPES = [
    TYPE_CONNECT = 'connect',
    TYPE_GRAMMAR = 'grammar'
  ]

  ALL_CONCEPT_FEEDBACKS_KEY = 'all_concept_feedbacks'

  validates :data, presence: true
  validates :uid, presence: true, uniqueness: { scope: :activity_type }
  validates :activity_type, presence: true, inclusion: {in: TYPES}
  validate :data_must_be_hash

  has_many :translation_mappings, as: :source
  has_many :english_texts, through: :translation_mappings
  has_many :translated_texts, through: :english_texts
  store_accessor :data, :description

  after_commit :clear_concept_feedbacks_cache

  def cache_key = "#{ALL_CONCEPT_FEEDBACKS_KEY}_#{activity_type}"

  def as_json(options=nil)
    data
  end

  def create_translation_mappings
    return if description.nil?
    return unless translation_mappings.empty?

    english_text = EnglishText.find_or_create_by(text: description)
    translation_mappings.create(english_text: )
  end

  def fetch_translations! = translated_texts.each(&:fetch_translation!)

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash)
  end

  private def clear_concept_feedbacks_cache
    $redis.del(cache_key)
  end
end
