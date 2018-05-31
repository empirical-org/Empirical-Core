class ClassroomActivitySerializer < ActiveModel::Serializer
  attributes :id, :classroom_id, :unit_id, :activity_id, :due_date,  :created_at, :updated_at, :formatted_due_date, :completed, :started

  has_one :activity
  has_one :classroom

  def formatted_due_date
    object.formatted_due_date
  end

  def completed
    object.has_a_completed_session?
  end

  def started
    object.has_a_started_session?
  end

end
