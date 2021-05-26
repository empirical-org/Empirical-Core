module Comprehension
  module ChangeLog
    def log_change(action, changed_record, explanation = nil, changed_attribute = nil, previous_value = nil, new_value = nil)
      binding.pry
      change_log = {
        user_id: current_user.id.to_s,
        action: ChangeLog::COMPREHENSION_ACTIONS[action],
        changed_record_type: changed_record.class.name,
        changed_record_id: changed_record.id,
        explanation: explanation,
        changed_attribute: changed_attribute,
        previous_value: previous_value,
        new_value: new_value
      }
      ChangeLog.create(change_log)
    end
  end
end
