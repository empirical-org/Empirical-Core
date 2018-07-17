class ClassroomUnitActivityState < ActiveRecord::Base
  include ::NewRelic::Agent
  include LessonsCache

  belongs_to :classroom_unit
  belongs_to :unit_activity

  after_save :update_lessons_cache_with_data

  before_validation :handle_pinning
  after_create :lock_if_lesson
  validate :not_duplicate, :only_one_pinned

  def visible
    self.classroom_unit.visible && self.unit_activity.visible
  end

  def update_lessons_cache_with_data
    update_lessons_cache(self)
  end

  private

  def lock_if_lesson
    if self.unit_activity.activity.is_lesson?
      self.update(locked: true)
    end
  end

  def not_duplicate
    cua = ClassroomUnitActivityState.find_by(
      classroom_unit_id: self.classroom_unit_id,
      unit_activity_id: self.unit_activity_id
    )
    if cua && (cua.id != self.id)
      begin
        raise 'This classroom unit activity state is a duplicate'
      rescue => e
        NewRelic::Agent.add_custom_attributes({
          classroom_unit_id: self.classroom_unit_id,
          unit_activity_id: self.unit_activity_id
        })
        NewRelic::Agent.notice_error(e)
        errors.add(:duplicate_classroom_unit_activity_state, "this classroom unit activity state is a duplicate")
      end
    else
      return true
    end
  end

  def handle_pinning
    if self.pinned == true
      if self.visible == false
        # unpin ca before archiving
        self.update!(pinned: false)
      else
        # unpin any other pinned ca before pinning new one
        classroom = self.classroom_unit.classroom
        classroom_unit_ids = classroom.classroom_units.ids.flatten
        pinned_cua = ClassroomUnitActivityState.unscoped.find_by(pinned: true, classroom_unit_id: [classroom_unit_ids])
        return if pinned_cua && pinned_cua == self
        pinned_cua.update_column("pinned", false) if pinned_cua
      end
    end
  end

  def only_one_pinned
    if self.pinned
      classroom = self.classroom_unit.classroom
      classroom_unit_ids = classroom.classroom_units.ids.flatten
      pinned_cuas = ClassroomUnitActivityState.unscoped.where(pinned: true, classroom_unit_id: [classroom_unit_ids])
      pinned_cuas.length == 1
    end
    return true
  end

end
