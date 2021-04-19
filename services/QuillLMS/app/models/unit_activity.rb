# == Schema Information
#
# Table name: unit_activities
#
#  id           :integer          not null, primary key
#  due_date     :datetime
#  order_number :integer
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
class UnitActivity < ActiveRecord::Base
  include ::NewRelic::Agent
  include CheckboxCallback

  belongs_to :unit #, touch: true
  belongs_to :activity
  has_many :classroom_unit_activity_states

  # validates :unit, uniqueness: { scope: :activity }

  after_save :hide_appropriate_activity_sessions, :teacher_checkbox

  def teacher_checkbox
    if unit && unit.user && unit.visible && visible
      owner = unit.user
      checkbox_name = checkbox_type
      if owner && unit.name
        find_or_create_checkbox(checkbox_name, owner, activity_id)
      end
    end
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
      due_date.month.to_s + "-" + due_date.day.to_s + "-" + due_date.year.to_s
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

  private def hide_appropriate_activity_sessions
    if visible == false
      hide_all_activity_sessions
    end
  end

  private def hide_all_activity_sessions
    if unit && unit.classroom_units
      unit.classroom_units.each do |cu|
        cu.activity_sessions.each do |as|
          as.update(visible: false) if as.activity == activity
        end
      end
    end
  end

  def self.get_classroom_user_profile(classroom_id, user_id)
    return [] unless classroom_id && user_id
    # Generate a rich profile of Classroom Activities for a given user in a given classroom
    ActiveRecord::Base.connection.execute(
     "SELECT unit.name,
      activity.name,
      activity.description,
      activity.repeatable,
      activity.activity_classification_id,
      unit.id AS unit_id,
      ua.id AS ua_id,
      unit.created_at AS unit_created_at,
      unit.name AS unit_name,
      cu.id AS ca_id,
      COALESCE(cuas.completed, 'f') AS marked_complete,
      ua.activity_id,
      MAX(acts.updated_at) AS act_sesh_updated_at,
      ua.order_number,
      ua.due_date,
      cu.created_at AS unit_activity_created_at,
      COALESCE(cuas.locked, 'f') AS locked,
      COALESCE(cuas.pinned, 'f') AS pinned,
      MAX(acts.percentage) AS max_percentage,
      SUM(CASE WHEN acts.state = 'started' THEN 1 ELSE 0 END) AS resume_link
      FROM unit_activities AS ua
      JOIN units AS unit ON unit.id = ua.unit_id
      JOIN classroom_units AS cu ON unit.id = cu.unit_id
      LEFT JOIN activity_sessions AS acts ON cu.id = acts.classroom_unit_id AND acts.activity_id = ua.activity_id AND acts.visible = true
      AND acts.user_id = #{user_id.to_i}
      JOIN activities AS activity ON activity.id = ua.activity_id
      LEFT JOIN classroom_unit_activity_states AS cuas ON ua.id = cuas.unit_activity_id
      AND cu.id = cuas.classroom_unit_id
      WHERE #{user_id.to_i} = ANY (cu.assigned_student_ids::int[])
      AND cu.classroom_id = #{classroom_id.to_i}
      AND cu.visible = true
      AND unit.visible = true
      AND ua.visible = true
      AND 'archived' != ANY(activity.flags)
      GROUP BY unit.id, unit.name, unit.created_at, cu.id, activity.name, activity.activity_classification_id, activity.id, activity.uid, ua.due_date, ua.created_at, unit_activity_id, cuas.completed, cuas.locked, cuas.pinned, ua.id

      ORDER BY pinned DESC, locked ASC, unit.created_at ASC, max_percentage DESC, ua.order_number ASC, ua.due_date ASC, ua.id ASC").to_a
  end

end
