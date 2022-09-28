# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_topics
#
#  id          :integer          not null, primary key
#  activity_id :integer          not null
#  topic_id    :integer          not null
#
# Indexes
#
#  index_activity_topics_on_activity_id  (activity_id)
#  index_activity_topics_on_topic_id     (topic_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (topic_id => topics.id)
#

class ActivityTopic < ApplicationRecord
  belongs_to :activity
  belongs_to :topic

  validate :activity_topic_level_one_validator

  def activity_topic_level_one_validator
    errors.add(:base, "Topics associated with Activities must be level one.") unless topic.present? && topic.level_one?
  end
end
