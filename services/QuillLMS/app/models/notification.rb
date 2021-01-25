# == Schema Information
#
# Table name: notifications
#
#  id         :integer          not null, primary key
#  meta       :jsonb            not null
#  text       :text             not null
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer          not null
#
# Indexes
#
#  index_notifications_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Notification < ActiveRecord::Base
  belongs_to :user

  validates :text, presence: true, length: { maximum: 500 }
  validates :user, presence: true

  def activity_student_report_path
    meta['activity_student_report_path']
  end
end
