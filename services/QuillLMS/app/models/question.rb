class Question < ActiveRecord::Base
  validates :uid, presence: true, uniqueness: true
  validates :data, presence: true
  validate :data_must_be_hash

  def as_json(options=nil)
    data
  end

  def add_focus_point(new_data)
    set_focus_point(new_uuid, new_data)
  end

  def set_focus_point(focus_point_id, new_data)
    self.data['focusPoints'] ||= {}
    self.data['focusPoints'][focus_point_id] = new_data
    save
    focus_point_id
  end

  def update_focus_points(new_data)
    self.data['focusPoints'] = new_data
    save
  end

  def delete_focus_point(focus_point_id)
    self.data['focusPoints'].delete(focus_point_id)
    save
  end

  def update_flag(flag_value)
    self.data['flag'] = flag_value
    save
  end

  def update_model_concept(model_concept_id)
    self.data['modelConceptUID'] = model_concept_id
    save
  end

  def add_incorrect_sequence(new_data)
    set_incorrect_sequence(new_uuid, new_data)
  end

  def set_incorrect_sequence(incorrect_sequence_id, new_data)
    self.data['incorrectSequences'] ||= {}
    self.data['incorrectSequences'][incorrect_sequence_id] = new_data
    save
    incorrect_sequence_id
  end

  def update_incorrect_sequences(new_data)
    self.data['incorrectSequences'] = new_data
    save
  end

  def delete_incorrect_sequence(incorrect_sequence_id)
    self.data['incorrectSequences'].delete(incorrect_sequence_id)
    save
  end

  def save
    valid = super
    $redis.del(Api::V1::QuestionsController::ALL_QUESTIONS_CACHE_KEY)
    valid
  end

  private def new_uuid
    SecureRandom.uuid
  end

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash)
  end
end
