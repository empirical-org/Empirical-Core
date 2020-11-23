class ActivityTopic < ActiveRecord::Base
  belongs_to :activity
  belongs_to :topic

  validates :topic_id, presence: true
end
