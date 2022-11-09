# frozen_string_literal: true

# == Schema Information
#
# Table name: unit_activities
#
#  id           :integer          not null, primary key
#  due_date     :datetime
#  order_number :integer
#  publish_date :datetime
#  visible      :boolean          default(TRUE)
#  created_at   :datetime
#  updated_at   :datetime
#  activity_id  :integer          not null
#  unit_id      :integer          not null
#
# Indexes
#
#  index_unit_activities_on_activity_id              (activity_id)
#  index_unit_activities_on_unit_id                  (unit_id)
#  index_unit_activities_on_unit_id_and_activity_id  (unit_id,activity_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (unit_id => units.id)
#
class UnitActivity < ApplicationRecord
  include CheckboxCallback

  belongs_to :unit, touch: true
  belongs_to :activity
  has_many :classroom_unit_activity_states

  after_save :hide_appropriate_activity_sessions, :teacher_checkbox

  def teacher_checkbox
    return unless unit
    return unless unit.user
    return unless unit.visible
    return unless unit.name
    return unless visible

    find_or_create_checkbox(checkbox_type, unit.user, activity_id)
  end

  def checkbox_type
    diagnostic_activity_ids = Activity.diagnostic_activity_ids
    if diagnostic_activity_ids.include?(activity_id)
      checkbox_name = 'Assign Entry Diagnostic'
    elsif unit && unit.unit_template_id
      checkbox_name = 'Assign Featured Activity Pack'
    else
      checkbox_name = 'Build Your Own Activity Pack'
    end
  end

  def due_date_string= val
    self.due_date = Date.strptime(val, Time::DATE_FORMATS[:quill_default])
  end

  def due_date_string
    due_date.try(:to_formatted_s, :quill_default)
  end

  def formatted_due_date
    if due_date.present?
      "#{due_date.month}-#{due_date.day}-#{due_date.year}"
    else
      ""
    end
  end

  def from_valid_date_for_activity_analysis?
    classification_id = activity.classification.id
    # if it is passage proofreader or sentence writing, we only want to show ones after this Date in certain reports
    # as previous to that date, concept results were not compatible with reports
    if [1,2].include?(classification_id)
      created_at > Date.parse('25-10-2016')
    else
      true
    end
  end

  def save_new_attributes_and_adjust_dates!(unit_activity_data)
    assign_attributes(unit_activity_data)
    adjust_dates_for_timezone
    save!
  end

  def adjust_dates_for_timezone
    adjust_due_date_for_timezone if will_save_change_to_due_date?
    adjust_publish_date_for_timezone if will_save_change_to_publish_date?
  end

  def adjust_due_date_for_timezone
    return unless due_date.present?

    self.due_date = due_date.in_time_zone('UTC') - unit.user.utc_offset
  end

  def adjust_publish_date_for_timezone
    return unless publish_date.present?

    self.publish_date = publish_date.in_time_zone('UTC') - unit.user.utc_offset
  end

  def hide_all_activity_sessions
    unit
      &.activity_sessions
      &.where(activity: activity)
      &.update_all(visible: false)
  end

  private def hide_appropriate_activity_sessions
    return if visible

    hide_all_activity_sessions
  end

  def self.get_classroom_user_profile(classroom_id, user_id)
    return [] unless classroom_id && user_id

    student_timezone_offset_string = "+ INTERVAL '#{User.find(user_id).utc_offset || 0}' SECOND"

    # Generate a rich profile of Classroom Activities for a given user in a given classroom
    RawSqlRunner.execute(
     <<-SQL
        SELECT
          unit.name,
          activity.name,
          activity.description,
          activity.repeatable,
          activity.activity_classification_id,
          activity_classifications.key AS activity_classification_key,
          unit.id AS unit_id,
          ua.id AS ua_id,
          unit.created_at AS unit_created_at,
          unit.name AS unit_name,
          cu.id AS classroom_unit_id,
          COALESCE(cuas.completed, false) AS marked_complete,
          ua.activity_id,
          MAX(acts.updated_at) AS act_sesh_updated_at,
          ua.order_number,
          ua.due_date #{student_timezone_offset_string} AS due_date,
          MIN(acts.completed_at) #{student_timezone_offset_string} AS completed_date,
          pre_activity.id AS pre_activity_id,
          cu.created_at AS unit_activity_created_at,
          upsi.status AS user_pack_sequence_item_status,
          COALESCE(cuas.locked, false) AS locked,
          COALESCE(cuas.pinned, false) AS pinned,
          MAX(acts.percentage) AS max_percentage,
          SUM(CASE WHEN pre_activity_sessions_classroom_units.id > 0 AND pre_activity_sessions.state = '#{ActivitySession::STATE_FINISHED}' THEN 1 ELSE 0 END) > 0 AS completed_pre_activity_session,
          SUM(CASE WHEN acts.state = '#{ActivitySession::STATE_FINISHED}' THEN 1 ELSE 0 END) > 0 AS #{ActivitySession::STATE_FINISHED_KEY},
          SUM(CASE WHEN acts.state = '#{ActivitySession::STATE_STARTED}' THEN 1 ELSE 0 END) AS resume_link
        FROM unit_activities AS ua
        JOIN units AS unit
          ON unit.id = ua.unit_id
        JOIN classroom_units AS cu
          ON unit.id = cu.unit_id
        LEFT JOIN activity_sessions AS acts
          ON cu.id = acts.classroom_unit_id
          AND acts.activity_id = ua.activity_id
          AND acts.visible = true
          AND acts.user_id = #{user_id.to_i}
        JOIN activities AS activity
          ON activity.id = ua.activity_id
        LEFT JOIN activities AS pre_activity
          ON pre_activity.follow_up_activity_id = ua.activity_id
        LEFT JOIN activity_sessions AS pre_activity_sessions
          ON pre_activity_sessions.activity_id = pre_activity.id
          AND pre_activity_sessions.visible = true
          AND pre_activity_sessions.user_id = #{user_id.to_i}
        LEFT JOIN classroom_units AS pre_activity_sessions_classroom_units
          ON pre_activity_sessions_classroom_units.id = pre_activity_sessions.classroom_unit_id
          AND pre_activity_sessions_classroom_units.classroom_id = #{classroom_id.to_i}
        JOIN activity_classifications
          ON activity.activity_classification_id = activity_classifications.id
        LEFT JOIN classroom_unit_activity_states AS cuas
          ON ua.id = cuas.unit_activity_id
          AND cu.id = cuas.classroom_unit_id
        JOIN users AS teachers ON unit.user_id = teachers.id
        LEFT JOIN pack_sequence_items AS psi
          ON psi.unit_id = unit.id
        LEFT JOIN user_pack_sequence_items AS upsi
          ON upsi.pack_sequence_item_id = psi.id
          AND upsi.user_id = #{user_id.to_i}
        WHERE #{user_id.to_i} = ANY (cu.assigned_student_ids::int[])
          AND cu.classroom_id = #{classroom_id.to_i}
          AND cu.visible = true
          AND unit.visible = true
          AND ua.visible = true
          AND (ua.publish_date IS NULL OR ua.publish_date <= NOW())
        GROUP BY
          unit.id,
          unit.name,
          unit.created_at,
          cu.id,
          activity.name,
          activity.activity_classification_id,
          activity.id,
          activity.uid,
          ua.due_date,
          ua.publish_date,
          ua.created_at,
          unit_activity_id,
          cuas.completed,
          cuas.locked,
          cuas.pinned,
          ua.id,
          activity_classifications.key,
          pre_activity.id,
          teachers.time_zone,
          psi.id,
          upsi.id,
          upsi.status
        ORDER BY
          pinned DESC,
          locked ASC,
          unit.created_at ASC,
          max_percentage DESC,
          ua.order_number ASC,
          ua.due_date ASC,
          ua.id ASC
     SQL
    )
  end

end
