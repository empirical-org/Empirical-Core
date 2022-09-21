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

  validates :topic_id, presence: true

  before_save :validate_topic_level_one

  def validate_topic_level_one
    throw(:abort) unless topic.level_one?
  end
end
