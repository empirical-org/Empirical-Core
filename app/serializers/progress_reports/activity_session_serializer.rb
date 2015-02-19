class ProgressReports::ActivitySessionSerializer  < ActiveModel::Serializer
  attributes :id,
             :activity_classification_name,
             :activity_classification_id,
             :activity_name,
             :completed_at,
             :time_spent,
             :percentage,
             :display_score,
             :display_completed_at,
             :display_time_spent

  def activity_classification_name
    object.activity.classification.name
  end

  def activity_classification_id
    object.activity.classification.id
  end

  def activity_name
    object.activity.name
  end

  def completed_at
    object.completed_at.try(:to_i)
  end

  def time_spent
    if object.completed_at.present? and object.started_at.present?
      object.calculate_time_spent!
      object.time_spent
    end
  end

  def display_score
    object.percentage_as_percent
  end

  def display_completed_at
    object.completed_at.try(:to_formatted_s, :quill_default)
  end

  def display_time_spent
    time_spent_in_sec = time_spent
    (time_spent_in_sec / 60).to_i.to_s + ' minutes' if time_spent_in_sec.present?
  end
end