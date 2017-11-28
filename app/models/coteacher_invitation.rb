class CoteacherInvitation < ActiveRecord::Base

  belongs_to :inviter, class_name: 'User', foreign_key: 'inviter_id'

  



end
