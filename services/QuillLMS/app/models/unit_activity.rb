class UnitActivity < ActiveRecord::Base
  include ::NewRelic::Agent
  include CheckboxCallback

  belongs_to :unit, touch: true
  belongs_to :activity
  has_many :classroom_unit_activity_states

  validate :not_duplicate

  after_save  :hide_appropriate_activity_sessions, :teacher_checkbox

  def teacher_checkbox
    if self.unit && self.unit.user
      owner = self.unit.user
      checkbox_name = checkbox_type
      if owner && self.unit.name
        find_or_create_checkbox(checkbox_name, owner)
      end
    end
  end

  def checkbox_type
    diagnostic_activity_ids = Activity.diagnostic_activity_ids
    if diagnostic_activity_ids.include?(self.activity_id)
      checkbox_name = 'Assign Entry Diagnostic'
    elsif self.unit && self.unit.unit_template_id
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
    classification_id = self.activity.classification.id
    # if it is passage proofreader or sentence writing, we only want to show ones after this Date in certain reports
    # as previous to that date, concept results were not compatible with reports
    if [1,2].include?(classification_id)
      self.created_at > Date.parse('25-10-2016')
    else
      true
    end
  end

  private

  def not_duplicate
    ua = UnitActivity.find_by(activity_id: self.activity_id, unit_id: self.unit_id)
    if ua && (ua.id != self.id)
      begin
        raise 'This unit_activity is a duplicate'
      rescue => e
        NewRelic::Agent.add_custom_attributes({
          activity_id: self.activity_id,
          unit_id: self.unit_id
        })
        NewRelic::Agent.notice_error(e)
        errors.add(:duplicate_unit_activity, "this unit_activity is a duplicate")
      end
    else
      return true
    end
  end

  def hide_appropriate_activity_sessions
    if self.visible == false
      hide_all_activity_sessions
    end
  end

  def hide_all_activity_sessions
    if self.unit && self.unit.classroom_units
      self.unit.classroom_units.each do |cu|
        cu.activity_sessions.each do |as|
          as.update(visible: false) if as.activity == self.activity
        end
      end
    end
  end

end
