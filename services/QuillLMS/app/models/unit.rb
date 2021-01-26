# == Schema Information
#
# Table name: units
#
#  id               :integer          not null, primary key
#  name             :string
#  visible          :boolean          default(TRUE), not null
#  created_at       :datetime
#  updated_at       :datetime
#  unit_template_id :integer
#  user_id          :integer
#
# Indexes
#
#  index_units_on_unit_template_id  (unit_template_id)
#  index_units_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (unit_template_id => unit_templates.id)
#
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
  has_many :unit_activities, dependent: :destroy
  has_many :classroom_units, dependent: :destroy
  has_many :classrooms, through: :classroom_units
  has_many :activities, through: :unit_activities
  has_many :standards, through: :activities
  default_scope { where(visible: true)}
  belongs_to :unit_template
  after_save :hide_classroom_units_and_unit_activities_if_visible_false, :create_any_new_classroom_unit_activity_states
  after_touch :save

  def hide_if_no_visible_unit_activities
    if !unit_activities.where(visible: true).exists?
      update(visible: false)
    end
  end

  def hide_classroom_units_and_unit_activities_if_visible_false
    if visible == false
      UnitActivity.where(unit_id: id, visible: true).each{|ua| ua.update(visible: false)}
      ClassroomUnit.where(unit_id: id, visible: true).each{|cu| cu.update(visible: false)}
    end
  end

  def email_lesson_plan
    # limiting to production so teachers don't get emailed when we assign lessons from their account locally
    if Rails.env.production? || user.email.match('quill.org')
      unit_id = id
      activity_ids = Activity.select('DISTINCT(activities.id)')
      .joins("JOIN unit_activities ON unit_activities.activity_id = activities.id")
      .joins("JOIN units ON unit_activities.unit_id = #{unit_id}")
      .where( "activities.activity_classification_id = 6 AND activities.supporting_info IS NOT NULL")
      if activity_ids.any?
        activity_ids = activity_ids.map(&:id)
        teacher_id = user_id
        LessonPlanEmailWorker.perform_async(teacher_id, activity_ids, unit_id)
      end
    end
  end

  private

  def create_any_new_classroom_unit_activity_states
    lesson_unit_activities = unit_activities.select { |ua| ua.activity.is_lesson? }
    lesson_unit_activities.each do |ua|
      classroom_units.each do |cu|
        ClassroomUnitActivityState.find_or_create_by(unit_activity_id: ua.id, classroom_unit_id: cu.id)
      end
    end
  end

end
