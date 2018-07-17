class ClassroomActivity < ActiveRecord::Base
  include AtomicArrays

  belongs_to :classroom
  belongs_to :activity
  belongs_to :unit, touch: true
  has_one :topic, through: :activity
  has_many :activity_sessions

  # classroom unit (kinda funky logic currently... -> will have to either pass a
  # classroom_uinit_id or activity_id
  # classroom unit - modify to expect activity id as input param
  def assign_follow_up_lesson(locked=true)
    extant_ca = ClassroomActivity.find_by(classroom_id: self.classroom_id,
                                          activity_id: self.activity.follow_up_activity_id,
                                          unit_id: self.unit_id)
    if !self.activity.follow_up_activity_id
      return false
    elsif extant_ca
      extant_ca.update(locked: false)
      return extant_ca
    end
    follow_up = ClassroomActivity.create(classroom_id: self.classroom_id,
                             activity_id: self.activity.follow_up_activity_id,
                             unit_id: self.unit_id,
                             visible: true,
                             locked: locked,
                             assign_on_join: self.assign_on_join,
                             assigned_student_ids: self.assigned_student_ids )
    follow_up
  end

  # activity session (requires params)

end
