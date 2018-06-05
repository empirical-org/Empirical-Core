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
  belongs_to :user
  has_many :classroom_activities, dependent: :destroy
  has_many :classrooms, through: :classroom_activities
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities
  default_scope { where(visible: true)}
  belongs_to :unit_template
  after_save :hide_classroom_activities_if_visible_false
  # after_create :post_to_google_if_valid

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
    # limiting to production so teachers don't get emailed when we assign lessons from their account locally
    if Rails.env.production? || self.user.email.match('quill.org')
      unit_id = self.id
      activity_ids = Activity.select('DISTINCT(activities.id)')
      .joins("JOIN classroom_activities ON classroom_activities.activity_id = activities.id")
      .joins("JOIN units ON classroom_activities.unit_id = #{unit_id}")
      .where( "activities.activity_classification_id = 6 AND activities.supporting_info IS NOT NULL")
      if activity_ids.any?
        activity_ids = activity_ids.map(&:id)
        teacher_id = self.user_id
        LessonPlanEmailWorker.perform_async(teacher_id, activity_ids, unit_id)
      end
    end
  end

  private

  # def classrooms_with_google_id
  #   valid_classrooms = self.classrooms.where('google_classroom_id is not null')
  #   assigned_student_ids = ClassroomActivity.where(
  #     activity_id: Unit.last.activities.first,
  #     unit_id: Unit.last.id,
  #     classroom_id: self.classrooms.where('google_classroom_id is not null').ids
  #   ).pluck(:assigned_student_ids, :classroom_id, :assign_on_join)
  #   assigned_student_ids.map{|asi| {assigned_student_ids: asi.first, classroom: valid_classrooms.find{|vc| vc.id == asi[1]}, assign_on_join: asi.last}}
  # end

  def post_to_google_if_valid
    GoogleIntegration::Announcements.post_unit_to_valid_classrooms(self)
  end

end
