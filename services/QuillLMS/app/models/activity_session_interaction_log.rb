class ActivitySessionInteractionLog < ActiveRecord::Base
	validates :activity_session, presence: true
	belongs_to :activity_session
end
