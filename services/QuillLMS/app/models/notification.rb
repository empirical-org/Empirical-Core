class Notification < ActiveRecord::Base
  belongs_to :user

  validates :meta, presence: true
  validates :text, presence: true, length: { maximum: 500 }
  validates :user, presence: true

  def activity_student_report_path
    self.meta['activity_student_report_path']
  end
end
