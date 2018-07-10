class ClassroomUnitActivityState < ActiveRecord::Base
  belongs_to :classroom_unit
  belongs_to :unit_activity

  after_save :update_lessons_cache

  def fully_visible?
    self.classroom_unit.visible && self.unit_activity.visible
  end

  def update_lessons_cache
    LessonsCacheConcern::update_lessons_cache(self)
  end

end
