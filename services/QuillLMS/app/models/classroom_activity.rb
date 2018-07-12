class ClassroomActivity < ActiveRecord::Base
  include AtomicArrays

  belongs_to :classroom
  belongs_to :activity
  belongs_to :unit, touch: true
  has_one :topic, through: :activity
  has_many :activity_sessions

  # classroom unit (kinda funky logic currently... -> will have to either pass a
  # classroom_uinit_id or activity_id
  def generate_activity_url
    "#{ENV['DEFAULT_URL']}/teachers/classroom_activities/#{self.id}/activity_from_classroom_activity"
  end

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
  def find_or_create_started_activity_session(student_id)
    activity_session = ActivitySession.find_by(classroom_activity_id: self.id, user_id: student_id)
    if activity_session && activity_session.state == 'started'
      activity_session
    elsif activity_session && activity_session.state == 'unstarted'
      activity_session.update(state: 'started')
      activity_session
    else
      ActivitySession.create(classroom_activity_id: self.id, user_id: student_id, activity_id: self.activity_id, state: 'started', started_at: Time.now)
    end
  end
end
