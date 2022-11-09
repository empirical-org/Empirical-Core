class Activity < ApplicationRecord

  attr_accessor :lms_user_id
  after_save :log_evidence_flag_change, if: :update_evidence_flags?

  def flag(flag = nil)
    return super(flag) unless flag.nil?
    flags.first&.to_sym
  end

  def flag=(flag=nil)
    update(flags: [flag])
  end

  def child_activity
    Evidence::Activity.find_by(parent_activity_id: id)
  end

  private def update_evidence_flags?
    child_activity && saved_change_to_flags?
  end

  private def log_evidence_flag_change
    change_log = {
      user_id: @lms_user_id,
      action: ChangeLog::EVIDENCE_ACTIONS[:update],
      changed_record_type: 'Evidence::Activity',
      changed_record_id: child_activity&.id,
      explanation: nil,
      changed_attribute: "flags",
      previous_value: previous_changes["flags"][0],
      new_value: previous_changes["flags"][1]
    }
    ChangeLog.create(change_log)
  end
end
