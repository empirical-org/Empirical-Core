# frozen_string_literal: true

class Cms::ActivityUnitTemplateSerializer < ActiveModel::Serializer
  attributes :uid, :id, :name, :description, :flags, :data, :created_at, :updated_at, :supporting_info, :anonymous_path, :activity_category, :readability_grade_level, :unit_template_names

  has_one :classification, serializer: ClassificationSerializer
  has_one :standard

  def anonymous_path
    Rails.application.routes.url_helpers.anonymous_activity_sessions_path(activity_id: object.id)
  end

  def activity_category
    return unless object.id

    ActivityCategory
      .joins("JOIN activity_category_activities ON activity_categories.id = activity_category_activities.activity_category_id")
      .where("activity_category_activities.activity_id = #{object.id}")
      .limit(1)
      .to_a
      .first
  end

  def unit_template_names
    object.unit_templates.map {|ut| ut.name}
  end
end
