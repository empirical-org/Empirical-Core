# Include this module in any Comprehension classes that need to implement change logging behavior.

# Including this module allows a class to:
# -have many ChangeLog records (has_many, polymorphic)
# -log when the record is created
# -log when the record is updated

# For classes with the attribute 'text' defined, the module will only log changes on the text field.
# For classes without 'text' defined, the module will log all changes.

# If you need to customize logging behavior, define log_creation or log_update in the class itself
# to override default module behavior.

module Comprehension
  module ChangeLog
    extend ActiveSupport::Concern
    UNIVERSAL_RULE_ACTIONS = ['Universal Rule - updated', 'Universal Rule - created']

    included do
      attr_accessor :lms_user_id
      has_many :change_logs, as: :changed_record, class_name: "::ChangeLog"
      after_create :log_creation
      after_update :log_update
    end

    def log_creation
      if attributes.key?('text')
        log_change(@lms_user_id, :create, self, "text", nil, text)
      else
        log_change(@lms_user_id, :create, self, nil, nil, nil)
      end
    end

    def log_update
      # certain callbacks cause log_update to be called on creation, so we want to return early when a record has just been created
      return if id_changed?

      if !attributes.key?('text')
        changes.except("updated_at".to_sym).each do |key, value|
          log_change(@lms_user_id, :update, self, key, value[0], value[1])
        end
      elsif text_changed?
        log_change(@lms_user_id, :update, self, "text", text_was, text)
      end
    end

    def log_change(user_id, action, changed_record, changed_attribute = nil, previous_value = nil, new_value = nil)
      change_log = {
        user_id: user_id,
        action: Comprehension.change_log_class::COMPREHENSION_ACTIONS[action],
        changed_record_type: changed_record.class.name,
        changed_record_id: changed_record.id,
        changed_attribute: changed_attribute,
        previous_value: previous_value,
        new_value: new_value
      }
      Comprehension.change_log_class.create(change_log)
    end

    def change_logs_for_activity(activity)
      @activity = activity
      change_logs = activity_change_logs + passages_change_logs + prompts_change_logs + universal_change_logs
      change_logs.map {|cl|
        cl.merge(
          {
          "user": Comprehension.user_class.find_by(id: cl["user_id"])&.name,
          "updated_local_time": cl["updated_at"].localtime.to_s
          })
      }
    end

    def universal_change_logs
      Comprehension.change_log_class.where(action: UNIVERSAL_RULE_ACTIONS).map { |cl| cl.attributes.merge({name: Comprehension::Rule.find_by_id(cl.changed_record_id)&.name})} || []
    end

    def activity_change_logs
      Comprehension.change_log_class.where(changed_record_type: 'Comprehension::Activity', changed_record_id: @activity.id).map(&:attributes) || []
    end

    def passages_change_logs
      @activity.passages.map(&:change_logs).flatten.map(&:attributes)
    end

    def prompts_change_logs
      @activity.prompts.map { |prompt|
        prompt_logs = Comprehension.change_log_class.where(changed_record_type: 'Comprehension::Prompt', changed_record_id: prompt.id).map(&:attributes)
        logs = prompt_logs + automl_change_logs(prompt) + rules_change_logs(prompt)
        logs.map { |log|
          log.merge({conjunction: prompt.conjunction})
        }
      }.flatten || []
    end

    def automl_change_logs(prompt)
      prompt.automl_models.map {|a| Comprehension.change_log_class.where(changed_record_type: 'Comprehension::AutomlModel', changed_record_id: a.id).map {|cl| cl.attributes.merge({name: a.name})}}.flatten! || []
    end

    def rules_change_logs(prompt)
      prompt.rules.map { |rule|
        next [] if rule.universal_rule_type?
        rule_logs = Comprehension.change_log_class.where(changed_record_type: 'Comprehension::Rule', changed_record_id: rule.id).map(&:attributes)
        logs = rule_logs + label_change_logs(rule) + feedbacks_change_logs(rule) + regex_rules_change_logs(rule) + plagiarism_text_change_logs(rule)
        logs.map {|log|
          log.merge({name: rule.name})
        }
      }.flatten! || []
    end

    def plagiarism_text_change_logs(rule)
      Comprehension.change_log_class.where(changed_record_type: 'Comprehension::PlagiarismText', changed_record_id: rule.plagiarism_text&.id).map(&:attributes) || []
    end

    def label_change_logs(rule)
      Comprehension.change_log_class.where(changed_record_type: 'Comprehension::Label', changed_record_id: rule.label&.id).map(&:attributes) || []
    end

    def feedbacks_change_logs(rule)
      rule.feedbacks.map {|f|
        Comprehension.change_log_class.where(changed_record_type: 'Comprehension::Feedback', changed_record_id: f.id)
          .map(&:attributes) + highlights_change_logs(f)
      }.flatten! || []
    end

    def highlights_change_logs(feedback)
      feedback.highlights.map {|h| Comprehension.change_log_class.where(changed_record_type: 'Comprehension::Highlight', changed_record_id: h.id).map(&:attributes)}.flatten! || []
    end

    def regex_rules_change_logs(rule)
      rule.regex_rules.map {|rr| Comprehension.change_log_class.where(changed_record_type: 'Comprehension::RegexRule', changed_record_id: rr.id).map(&:attributes)}.flatten! || []
    end
  end
end
