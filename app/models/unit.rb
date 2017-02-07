class Unit < ActiveRecord::Base

  belongs_to :classroom
  belongs_to :user
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities
  default_scope { where(visible: true)}

  validates :name, uniqueness: { scope: [:user], if: Proc.new { |unit| unit.visible == true },
    message: "Unit name must be unique." }


  def hide_if_no_visible_classroom_activities
    if  ClassroomActivity.unscoped.where(unit_id: self.id, visible: false).length == self.classroom_activities.length
      self.update(visible: false)
    end
  end

end
