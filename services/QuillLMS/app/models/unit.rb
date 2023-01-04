# frozen_string_literal: true

# == Schema Information
#
# Table name: units
#
#  id               :integer          not null, primary key
#  active           :boolean          default(TRUE), not null
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
    return unless record.visible
    return if Unit.default_scoped.where(name: record.name, user_id: record.user_id, visible: true).where.not(id: record.id).none?

    record.errors.add(:name, 'must be unique.')
  end
end

class Unit < ApplicationRecord
  include ActiveModel::Validations

  validates_with UniqueNameWhenVisible

  belongs_to :user
  belongs_to :unit_template

  has_many :unit_activities, dependent: :destroy
  has_many :classroom_units, dependent: :destroy
  has_many :activity_sessions, through: :classroom_units
  has_many :classrooms, through: :classroom_units
  has_many :activities, through: :unit_activities
  has_many :standards, through: :activities

  default_scope { where(visible: true)}

  before_save :set_active_to_false

  after_save :save_user_pack_sequence_items, if: :visible
  after_save :hide_classroom_units_and_unit_activities
  after_save :create_any_new_classroom_unit_activity_states

  # Using an after_commit hook here because we want to trigger the callback
  # on save or touch, and touch explicitly bypasses after_save hooks
  after_commit :touch_all_classrooms_and_classroom_units

  def set_active_to_false
    return if visible

    self.active = false
  end

  def hide_if_no_visible_unit_activities
    return if unit_activities.exists?(visible: true)

    update(visible: false)
  end

  def hide_classroom_units_and_unit_activities
    return if visible

    unit_activities.where(visible: true).update(visible: false)
    classroom_units.where(visible: true).update(visible: false)
  end

  def email_lesson_plan
    # limiting to production so teachers don't get emailed when we assign lessons from their account locally
    return unless Rails.env.production? || user.email.match('quill.org')

    activity_ids =
      Activity
        .select('DISTINCT(activities.id)')
        .joins("JOIN unit_activities ON unit_activities.activity_id = activities.id")
        .joins("JOIN units ON unit_activities.unit_id = #{id}")
        .where( "activities.activity_classification_id = 6 AND activities.supporting_info IS NOT NULL")
        .pluck(:id)

    return if activity_ids.empty?

    LessonPlanEmailWorker.perform_async(user_id, activity_ids, id)
  end

  def save_user_pack_sequence_items
    classroom_units.each(&:save_user_pack_sequence_items)
  end

  def self.create_with_incremented_name(user_id:, name: )
    unit = Unit.create(user_id: user_id, name: name)
    return unit if unit.persisted?

    (2..20).each do |counter|
      unit = Unit.create(user_id: user_id, name: "#{name} #{counter}")
      return unit if unit.persisted?
    end
    false
  end

  private def create_any_new_classroom_unit_activity_states
    lesson_unit_activities = unit_activities.select { |ua| ua.activity.lesson? }
    lesson_unit_activities.each do |ua|
      classroom_units.each do |cu|
        ClassroomUnitActivityState.find_or_create_by(unit_activity_id: ua.id, classroom_unit_id: cu.id)
      end
    end
  end

  # modeled after Rails 6 touch_all
  # https://github.com/rails/rails/pull/31513/files#diff-18a561656864ea240daf46bdb1f50faace49f9ef74b90bcf667d9bbb17fce084R395
  private def touch_all_classrooms_and_classroom_units
    classroom_units.update_all(updated_at: current_time_from_proper_timezone)
    classrooms.update_all(updated_at: current_time_from_proper_timezone)
  end
end
