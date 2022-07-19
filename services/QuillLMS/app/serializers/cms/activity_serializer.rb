# frozen_string_literal: true

class Cms::ActivitySerializer < ApplicationSerializer
  attributes :uid, :id, :name, :description, :flags, :data, :created_at, :updated_at, :supporting_info, :activity_category, :readability_grade_level, :unit_templates

  has_one :classification, serializer: ClassificationSerializer

  def activity_category
    return unless object.id

    ActivityCategory
      .joins("JOIN activity_category_activities ON activity_categories.id = activity_category_activities.activity_category_id")
      .where("activity_category_activities.activity_id = #{object.id}")
      .limit(1)
      .to_a
      .first
  end

  def unit_templates
    object.unit_templates.where.not(flag: 'archived')
  end
end
