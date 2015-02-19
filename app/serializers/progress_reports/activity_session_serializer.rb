class ProgressReports::ActivitySessionSerializer  < ActiveModel::Serializer
  attributes :id,
             :activity_classification_name,
             :activity_classification_id,
             :activity_name,
             :completed_at,
             :time_spent,
             :percentage

  def activity_classification_name
    object.activity.classification.name
  end

  def activity_classification_id
    object.activity.classification.id
  end

  def activity_name
    object.activity.name
  end

  # Return time spent on the activity in seconds
  def time_spent
    if object.completed_at.present? and object.started_at.present?
      (object.completed_at - object.started_at) * 1.seconds
    end
  end
end