class ActivitySerializer < ActiveModel::Serializer
  attributes :uid, :id, :name, :description, :flags, :data, :created_at, :updated_at, :supporting_info, :anonymous_path, :activity_category

  has_one :classification, serializer: ClassificationSerializer
  has_one :standard

  def anonymous_path
    Rails.application.routes.url_helpers.anonymous_activity_sessions_path(activity_id: object.id)
  end

  def activity_category
    if object.id
      ActivityCategory.joins("JOIN activity_category_activities ON activity_categories.id = activity_category_activities.activity_category_id")
      .where("activity_category_activities.activity_id = #{object.id}")
      .limit(1).to_a.first
    end
  end

end
