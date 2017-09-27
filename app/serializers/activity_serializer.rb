class ActivitySerializer < ActiveModel::Serializer
  attributes :uid, :id, :name, :description, :flags, :data, :created_at, :updated_at, :supporting_info, :anonymous_path, :activity_category

  has_one :classification, serializer: ClassificationSerializer
  has_one :topic

  def anonymous_path
    Rails.application.routes.url_helpers.anonymous_activity_sessions_path(activity_id: object.id)
  end

  def activity_category
    object.activity_category_activities&.first&.activity_category
  end

end
