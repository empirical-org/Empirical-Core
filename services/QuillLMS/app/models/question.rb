# frozen_string_literal: true

# == Schema Information
#
# Table name: questions
#
#  id            :integer          not null, primary key
#  data          :jsonb            not null
#  question_type :string           not null
#  uid           :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_questions_on_question_type  (question_type)
#  index_questions_on_uid            (uid) UNIQUE
#
class Question < ApplicationRecord
  TYPES = [
    TYPE_CONNECT_SENTENCE_COMBINING = 'connect_sentence_combining',
    TYPE_CONNECT_SENTENCE_FRAGMENTS = 'connect_sentence_fragments',
    TYPE_CONNECT_FILL_IN_BLANKS = 'connect_fill_in_blanks',
    TYPE_DIAGNOSTIC_SENTENCE_COMBINING = 'diagnostic_sentence_combining',
    TYPE_DIAGNOSTIC_SENTENCE_FRAGMENTS = 'diagnostic_sentence_fragments',
    TYPE_DIAGNOSTIC_FILL_IN_BLANKS = 'diagnostic_fill_in_blanks',
    TYPE_GRAMMAR_QUESTION = 'grammar'
  ]

  FLAGS = [
    FLAG_PRODUCTION = 'production',
    FLAG_ALPHA = 'alpha',
    FLAG_BETA = 'beta',
    FLAG_ARCHIVED = 'archived',
    FLAG_TEST = 'test'
  ]
  LIVE_FLAGS = [FLAG_PRODUCTION, FLAG_ALPHA, FLAG_BETA]

  CACHE_KEY_ALL = 'ALL_QUESTIONS_v1_'
  CACHE_EXPIRY = 24.hours
  CACHE_KEY_QUESTION = 'QUESTION_v1_'

  # mapping extracted from Grammar,Connect,Diagnostic rematching.ts
  REMATCH_TYPE_MAPPING = {
    TYPE_CONNECT_SENTENCE_COMBINING => 'questions',
    TYPE_CONNECT_SENTENCE_FRAGMENTS => 'sentenceFragments',
    TYPE_CONNECT_FILL_IN_BLANKS => 'fillInBlankQuestions',
    TYPE_DIAGNOSTIC_SENTENCE_COMBINING => 'diagnostic_questions',
    TYPE_DIAGNOSTIC_SENTENCE_FRAGMENTS => 'diagnostic_sentenceFragments',
    TYPE_DIAGNOSTIC_FILL_IN_BLANKS => 'diagnostic_fillInBlankQuestions',
    TYPE_GRAMMAR_QUESTION => 'grammar_questions',
  }

  validates :data, presence: true
  validates :question_type, presence: true, inclusion: {in: TYPES}
  validates :uid, presence: true, uniqueness: true
  validate :data_must_be_hash
  validate :validate_sequences

  after_save :refresh_caches

  scope :live, -> {where("data->>'flag' IN (?)", LIVE_FLAGS)}
  scope :production, -> {where("data->>'flag' = ?", FLAG_PRODUCTION)}

  def as_json(options=nil)
    data
  end

  def self.all_questions_json(question_type)
    where(question_type: question_type)
      .reduce({}) { |agg, q| agg.update({q.uid => q.as_json}) }
      .to_json
  end

  def self.all_questions_json_cached(question_type, refresh: false)
    Rails.cache.fetch(CACHE_KEY_ALL + question_type, expires_in: CACHE_EXPIRY, force: refresh) do
      all_questions_json(question_type)
    end
  end

  def self.question_json_cached(uid, refresh: false)
    Rails.cache.fetch(CACHE_KEY_QUESTION + uid.to_s, expires_in: CACHE_EXPIRY, force: refresh) do
      find_by!(uid: uid).to_json
    end
  end

  def add_focus_point(new_data)
    new_uid = new_uuid
    return new_uid if set_focus_point(new_uid, new_data)
  end

  def set_focus_point(focus_point_id, new_data)
    data['focusPoints'] ||= {}
    data['focusPoints'][focus_point_id] = new_data
    save
  end

  def update_focus_points(new_data)
    data['focusPoints'] = new_data
    save
  end

  def delete_focus_point(focus_point_id)
    data['focusPoints'].delete(focus_point_id)
    save
  end

  def update_flag(flag_value)
    data['flag'] = flag_value
    save
  end

  def update_model_concept(model_concept_id)
    data['modelConceptUID'] = model_concept_id
    save
  end

  def get_incorrect_sequence(incorrect_sequence_id)
    return nil if !data['incorrectSequences']

    incorrect_sequence_id = incorrect_sequence_id.to_i if stored_as_array?('incorrectSequences')
    return data['incorrectSequences'][incorrect_sequence_id]
  end

  def add_incorrect_sequence(new_data)
    if stored_as_array?('incorrectSequences')
      new_id = data['incorrectSequences'].length
    else
      new_id = new_uuid
    end
    return new_id if set_incorrect_sequence(new_id, new_data)
  end

  def set_incorrect_sequence(incorrect_sequence_id, new_data)
    data['incorrectSequences'] ||= {}
    incorrect_sequence_id = incorrect_sequence_id.to_i if stored_as_array?('incorrectSequences')
    data['incorrectSequences'][incorrect_sequence_id] = new_data
    save
  end

  def update_incorrect_sequences(new_data)
    data['incorrectSequences'] = new_data
    save
  end

  def delete_incorrect_sequence(incorrect_sequence_id)
    if stored_as_array?('incorrectSequences')
      data['incorrectSequences'].delete_at(incorrect_sequence_id.to_i)
    else
      data['incorrectSequences'].delete(incorrect_sequence_id)
    end
    save
  end

  # this attribute is used by the CMS's Rematch All process
  def rematch_type
    REMATCH_TYPE_MAPPING.fetch(question_type)
  end

  private def refresh_caches
    Rails.cache.delete(CACHE_KEY_QUESTION + uid.to_s)
    Rails.cache.delete(CACHE_KEY_ALL + question_type)
    RefreshQuestionCacheWorker.perform_async(question_type, uid)
  end

  private def new_uuid
    SecureRandom.uuid
  end

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash)
  end

  private def stored_as_array?(key)
    data[key].instance_of?(Array)
  end

  private def validate_sequences
    return if data.blank? || !data.is_a?(Hash)

    parse_and_validate(data['incorrectSequences'])
    parse_and_validate(data['focusPoints'])
  end

  private def parse_and_validate(sequences)
    return if sequences.blank?

    case sequences
    when Hash
      sequences.each { |key, value| validate_text_and_feedback(value) }
    when Array
      sequences.each { |value| validate_text_and_feedback(value) }
    end
  end

  private def validate_text_and_feedback(value)
    if value['text'].nil? || value['feedback'].nil?
      errors.add(:data, "Focus Points and Incorrect Sequences must have text and feedback.")
      return
    end

    value['text'].split('|||').each { |regex| validate_regex(regex) }
  end

  private def validate_regex(regex)
    Regexp.new(regex)
  rescue RegexpError => e
    errors.add(:data, "There is incorrectly formatted regex: #{regex}")
  end
end
