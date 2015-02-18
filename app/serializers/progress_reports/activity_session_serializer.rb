class ProgressReports::ActivitySessionSerializer  < ActiveModel::Serializer
  attributes :id, :activity_classification_name

  def activity_classification_name
    object.activity.classification.name
  end
end