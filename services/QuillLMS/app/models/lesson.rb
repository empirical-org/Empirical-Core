class Lesson < ActiveRecord::Base
  TYPES = [
    TYPE_CONNECT_LESSON = 'connect_lesson',
    TYPE_DIAGNOSTIC_LESSON = 'diagnostic_lesson',
    TYPE_GRAMMAR_ACTIVITY = 'grammar_activity',
    TYPE_PROOFREADER_PASSAGE = 'proofreader_passage'
  ]
  validates :data, presence: true
  validates :uid, presence: true, uniqueness: true
  validates :lesson_type, presence: true, inclusion: {in: TYPES}
  validate :data_must_be_hash

  def as_json(options=nil)
    data
  end

  def add_question(question)
    return if !validate_question(question)
    data['questions'] ||= []
    data['questions'].push(question)
    save
  end

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash)
  end

  private def validate_question(question)
    if Question.find_by_uid(question[:key]).blank? && TitleCard.find_by_uid(question[:key]).blank?
      errors.add(:question, "Question #{question[:key]} does not exist.")
      return false
    end
    if data["questionType"] != question[:questionType]
      errors.add(:question, "The question type #{question[:questionType]} does not match the lesson's question type: #{data['questionType']}")
      return false
    end
    return true
  end
end
