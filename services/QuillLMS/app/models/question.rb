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
  include Translatable

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
    FLAG_ARCHIVED = 'archived'
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

  INCORRECT_SEQUENCES = 'incorrectSequences'
  FOCUS_POINTS = 'focusPoints'
  FEEDBACK_TYPES = [INCORRECT_SEQUENCES, FOCUS_POINTS]

  has_many :diagnostic_question_optimal_concepts, class_name: 'DiagnosticQuestionOptimalConcept', foreign_key: :question_uid, primary_key: :uid, dependent: :destroy
  has_many :diagnostic_question_skills

  validates :data, presence: true
  validates :question_type, presence: true, inclusion: {in: TYPES}
  validates :uid, presence: true, uniqueness: true
  validate :data_must_be_hash
  validate :validate_sequences


  store_accessor :data, :incorrectSequences
  store_accessor :data, :focusPoints
  store_accessor :data, :flag
  attr_accessor :skip_refresh_caches

  after_save :refresh_caches, unless: -> { skip_refresh_caches }

  scope :live, -> {where("data->>'flag' IN (?)", LIVE_FLAGS)}
  scope :production, -> {where("data->>'flag' = ?", FLAG_PRODUCTION)}

  def as_json(options=nil)
    translated_json(options)
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

  def update_flag(flag_value)
    self.flag = flag_value
    save
  end

  def update_model_concept(model_concept_id)
    data['modelConceptUID'] = model_concept_id
    save
  end

  def save_uids_for(type)
    return unless stored_as_array?(type)

    new_data = add_uid(data: data[type])
    data[type] = new_data
    save
  end

  def get_incorrect_sequence(incorrect_sequence_id)
    return nil if !incorrectSequences

    incorrect_sequence_id = incorrect_sequence_id.to_i if stored_as_array?(INCORRECT_SEQUENCES)
    return incorrectSequences[incorrect_sequence_id]
  end

  def add_incorrect_sequence(new_data)
    add_data_for(type: INCORRECT_SEQUENCES, new_data:)
  end

  def add_focus_point(new_data)
    add_data_for(type: FOCUS_POINTS, new_data:)
  end

  def set_focus_point(id, new_data)
    set_data_for(type: FOCUS_POINTS, id:, new_data:)
  end

  def set_incorrect_sequence(id, new_data)
    set_data_for(type: INCORRECT_SEQUENCES, id:, new_data:)
  end

  def update_incorrect_sequences(new_data)
    update_data_for(type: INCORRECT_SEQUENCES, new_data:)
  end

  def update_focus_points(new_data)
    update_data_for(type: FOCUS_POINTS, new_data:)
  end

  def delete_focus_point(id)
    delete_data_for(id:, type: FOCUS_POINTS)
  end

  def delete_incorrect_sequence(id)
    delete_data_for(id:, type: INCORRECT_SEQUENCES)
  end


  # this attribute is used by the CMS's Rematch All process
  def rematch_type
    REMATCH_TYPE_MAPPING.fetch(question_type)
  end

  def connect_sentence_combining?
    question_type == TYPE_CONNECT_SENTENCE_COMBINING
  end

  # Translatable
  def self.translatable_field_name = 'instructions'

  private def add_data_for(type:, new_data:)
    if stored_as_array?(type)
      id = data[type].length
    else
      id = new_uuid
    end
    return id if set_data_for(type:, id:, new_data:)
  end

  private def add_uid(data:)
    return data unless data.is_a?(Array)

    data.each do |item|
      item['uid'] ||= new_uuid
    end
    data
  end

  private def set_data_for(type:, id:, new_data:)
    data[type] ||= {}
    id = id.to_i if stored_as_array?(type)
    new_data  = {'uid' => new_uuid}.merge(new_data) if stored_as_array?(type)
    data[type][id] = new_data
    save
  end

  private def update_data_for(type:, new_data:)
    data[type] = add_uid(data: new_data)
    save
  end

  private def delete_data_for(id:, type:)
    if stored_as_array?(type)
      data[type].delete_at(id.to_i)
    else
      data[type].delete(id)
    end
    save
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
    errors.add(:data, 'must be a hash') unless data.is_a?(Hash)
  end

  private def stored_as_array?(key)
    data[key].instance_of?(Array)
  end

  private def validate_sequences
    return if data.blank? || !data.is_a?(Hash)

    FEEDBACK_TYPES.each {|type| parse_and_validate(type) }
  end

  private def parse_and_validate(type)
    sequences = data[type]
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
      errors.add(:data, 'Focus Points and Incorrect Sequences must have text and feedback.')
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
