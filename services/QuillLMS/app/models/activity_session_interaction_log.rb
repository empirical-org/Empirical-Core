class ActivitySessionInteractionLog < ActiveRecord::Base
	#validates :activity_session, presence: true - slows down log addition #substantially
	belongs_to :activity_session
end
