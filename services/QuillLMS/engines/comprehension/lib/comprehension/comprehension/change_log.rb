module Comprehension
  module ChangeLog
    def log_change(user_id, action, changed_record, explanation = nil, changed_attribute = nil, previous_value = nil, new_value = nil)
      change_log = {
        user_id: user_id,
        action: Comprehension.change_log_class::COMPREHENSION_ACTIONS[action],
        changed_record_type: changed_record.class.name,
        changed_record_id: changed_record.id,
        explanation: explanation,
        changed_attribute: changed_attribute,
        previous_value: previous_value,
        new_value: new_value
      }
      Comprehension.change_log_class.create(change_log)
    end
  end
end
