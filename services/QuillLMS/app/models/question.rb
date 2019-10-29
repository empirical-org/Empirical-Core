class Question < ActiveRecord::Base
  validates :uid, presence: true, uniqueness: true
  validates :data, presence: true

  def as_json(options=nil)
    self.data
  end

  def add_focus_point(data)
    set_focus_point(new_uuid, data)
  end

  def set_focus_point(uid, data)
    self.data['focusPoints'][uid] = data
    save
    uid
  end

  def update_focus_points(data)
    self.data['focusPoints'] = data
    save
  end

  def delete_focus_point(uid)
    self.data['focusPoints'].delete(uid)
    save
  end

  def update_flag(flag_value)
    self.data['flag'] = flag_value
    save
  end

  def update_model_concept(uid)
    self.data['modelConceptUID'] = uid
    save
  end

  def add_incorrect_sequence(data)
    set_incorrect_sequence(new_uuid, data)
  end

  def set_incorrect_sequence(uid, data)
    self.data['incorrectSequences'][uid] = data
    save
    uid
  end

  def update_incorrect_sequences(data)
    self.data['incorrectSequences'] = data
    save
  end

  private def new_uuid
    SecureRandom.uuid
  end
end
