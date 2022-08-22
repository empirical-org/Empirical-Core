# frozen_string_literal: true

# == Schema Information
#
# Table name: activities
#
#  id                         :integer          not null, primary key
#  data                       :jsonb
#  description                :text
#  flags                      :string           default([]), not null, is an Array
#  maximum_grade_level        :integer
#  minimum_grade_level        :integer
#  name                       :string
#  repeatable                 :boolean          default(TRUE)
#  supporting_info            :string
#  uid                        :string           not null
#  created_at                 :datetime
#  updated_at                 :datetime
#  activity_classification_id :integer
#  follow_up_activity_id      :integer
#  raw_score_id               :integer
#  standard_id                :integer
#  topic_id                   :integer
#
# Indexes
#
#  index_activities_on_activity_classification_id  (activity_classification_id)
#  index_activities_on_raw_score_id                (raw_score_id)
#  index_activities_on_topic_id                    (topic_id)
#  index_activities_on_uid                         (uid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (raw_score_id => raw_scores.id)
#  fk_rails_...  (standard_id => standards.id)
#
class ActivitySerializer < ApplicationSerializer
  attributes :uid, :id, :name, :description, :flags, :data, :created_at, :updated_at, :supporting_info, :anonymous_path, :activity_category, :readability_grade_level

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

end
