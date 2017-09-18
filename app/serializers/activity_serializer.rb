class ActivitySerializer < ActiveModel::Serializer
  attributes :uid, :id, :name, :description, :flags, :data, :created_at, :updated_at, :anonymous_path

  has_one :classification, serializer: ClassificationSerializer
  has_one :topic

  def anonymous_path
    Rails.application.routes.url_helpers.anonymous_activity_sessions_path(activity_id: object.id)
  end

end
