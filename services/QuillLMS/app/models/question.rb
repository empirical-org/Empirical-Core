class Question < ActiveRecord::Base
  TYPES = [
    TYPE_CONNECT_SENTENCE_COMBINING = 'connect_sentence_combining',
    TYPE_DIAGNOSTIC_SENTENCE_COMBINING = 'diagnostic_sentence_combining'
  ]
  validates :data, presence: true
  validates :question_type, presence: true, inclusion: {in: TYPES}
  validates :uid, presence: true, uniqueness: true
  validate :data_must_be_hash

  after_save :expire_all_questions_cache

  def as_json(options=nil)
    data
  end

  def add_focus_point(new_data)
    set_focus_point(new_uuid, new_data)
  end

  def set_focus_point(focus_point_id, new_data)
    data['focusPoints'] ||= {}
    data['focusPoints'][focus_point_id] = new_data
    save
    focus_point_id
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

  def add_incorrect_sequence(new_data)
    set_incorrect_sequence(new_uuid, new_data)
  end

  def set_incorrect_sequence(incorrect_sequence_id, new_data)
    data['incorrectSequences'] ||= {}
    data['incorrectSequences'][incorrect_sequence_id] = new_data
    save
    incorrect_sequence_id
  end

  def update_incorrect_sequences(new_data)
    data['incorrectSequences'] = new_data
    save
  end

  def delete_incorrect_sequence(incorrect_sequence_id)
    data['incorrectSequences'].delete(incorrect_sequence_id)
    save
  end

  private def expire_all_questions_cache
    cache_key = Api::V1::QuestionsController::ALL_QUESTIONS_CACHE_KEY + "_#{question_type}"
    $redis.del(cache_key)
    cache_key = "#{Api::V1::QuestionsController::QUESTION_CACHE_KEY_PREFIX}_#{uid}"
    $redis.del(cache_key)
  end

  private def new_uuid
    SecureRandom.uuid
  end

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash)
  end
end
