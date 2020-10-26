class ActivityTopic < ActiveRecord::Base
  belongs_to :activity
  belongs_to :topic

  validates :activity_id, presence: true
  validates :topic_id, presence: true
end
