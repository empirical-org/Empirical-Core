class UniqueNameWhenVisible < ActiveModel::Validator
  def validate(record)
    if record.visible
      if Unit.where(name: record.name, user_id: record.user_id, visible: true).where.not(id: record.id).any?
        record.errors[:name] << 'must be unique.'
      end
    end
  end
end


class Unit < ActiveRecord::Base
  include ActiveModel::Validations
  validates_with UniqueNameWhenVisible
  belongs_to :classroom
  belongs_to :user
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities
  default_scope { where(visible: true)}
  after_save :hide_classroom_activities_if_visible_false

  def hide_if_no_visible_classroom_activities
    if self.classroom_activities.length == 0
      self.update(visible: false)
    end
  end

  def hide_classroom_activities_if_visible_false
    if self.visible == false
      ClassroomActivity.where(unit_id: self.id, visible: true).each{|ca| ca.update(visible: false)}
    end
  end

  def email_lesson_plan
    activity_ids = Activity.select('DISTINCT(activities.id)')
    .joins("JOIN classroom_activities ON classroom_activities.activity_id = activities.id")
    .joins("JOIN units ON classroom_activities.unit_id = #{self.id}")
    .where( "activities.activity_classification_id = 6 AND activities.supporting_info IS NOT NULL")
    if activity_ids.any?
      teacher_id = self.user_id
      activity_ids.each do |lesson|
        LessonPlanEmailWorker.perform_async(teacher_id, lesson.id)
      end
    end
  end

end
