class ClassroomActivity < ActiveRecord::Base
  belongs_to :classroom
  belongs_to :activity
  belongs_to :unit
  # belongs_to :chapter, foreign_key: 'activity_id' #REMOVE
  has_many :activity_enrollments, dependent: :destroy
  # default_scope -> { includes(:chapter).order('chapters.title ASC') }

  def due_date_string= val
    self.due_date = Date.strptime(val, '%m/%d/%Y')
  end

  def due_date_string
    due_date.try(:strftime, '%m/%d/%Y')
  end

  def enrollment_for user
    activity_enrollments.find_or_create_by!(user_id: user.id)
  end
end
