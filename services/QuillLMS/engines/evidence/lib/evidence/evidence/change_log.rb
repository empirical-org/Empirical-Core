# frozen_string_literal: true

# Include this module in any Evidence classes that need to implement change logging behavior.

# Including this module allows a class to:
# -have many ChangeLog records (has_many, polymorphic)
# -log when the record is created
# -log when the record is updated

# For classes with the attribute 'text' defined, the module will only log changes on the text field.
# For classes without 'text' defined, the module will log all changes.

# If you need to customize logging behavior, define log_creation or log_update in the class itself
# to override default module behavior.

module Evidence
  module ChangeLog
    extend ActiveSupport::Concern

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
      return unless id_before_last_save

      if !attributes.key?('text')
        saved_changes.except("updated_at".to_sym).each do |key, value|
          log_change(@lms_user_id, :update, self, key, value[0], value[1])
        end
      elsif saved_change_to_text?
        log_change(@lms_user_id, :update, self, "text", text_before_last_save, text)
      end
    end

    def log_change(user_id, action, changed_record, changed_attribute = nil, previous_value = nil, new_value = nil)
      change_log = {
        user_id: user_id,
        action: Evidence.change_log_class::EVIDENCE_ACTIONS[action],
        changed_record_type: changed_record.class.name,
        changed_record_id: changed_record.id,
        changed_attribute: changed_attribute,
        previous_value: previous_value,
        new_value: new_value
      }
      Evidence.change_log_class.create(change_log)
    end

    def activity_versions
      Evidence.change_log_class.where(changed_record_id: id, changed_attribute: 'version', changed_record_type: 'Evidence::Activity').map do |row|
        {
          note: row.explanation,
          created_at: row.created_at,
          new_value: row.new_value,
          session_count: session_count(row, id)
        }
      end
    end

    def session_count(change_log, activity_id)
      start_date = change_log.created_at
      end_date = Time.current
      next_new_value = change_log.new_value.to_i + 1
      next_change_log =
        Evidence::Activity
          &.find_by(id: activity_id)
          &.change_logs
          &.where(changed_attribute: 'version', new_value: next_new_value)
          &.first
      end_date = next_change_log.created_at if next_change_log
      options = {
        activity_id: activity_id,
        start_date: start_date,
        end_date: end_date,
        page_size: nil
      }
      FeedbackHistory.list_by_activity_session(**options).length
    end

    def change_logs_for_activity
      @activity = Evidence::Activity.includes(
                      :change_logs,
                      passages: [:change_logs],
                      prompts: [
                        :change_logs,
                        rules: [
                          :change_logs,
                          feedbacks:
                            [:change_logs, highlights: [:change_logs]],
                          regex_rules: [:change_logs],
                          plagiarism_texts: [:change_logs]
                        ],
                      automl_models: [:change_logs]
                      ]
                    ).find(id)
      change_logs = activity_change_logs + passages_change_logs + prompts_change_logs + universal_change_logs
      change_logs.map(&:serializable_hash)
    end

    def universal_change_logs
      Evidence::Rule.select { |r| r.universal_rule_type? }.map(&:change_logs).flatten || []
    end

    def activity_change_logs
      @activity.change_logs || []
    end

    def passages_change_logs
      @activity.passages.map(&:change_logs).flatten || []
    end

    def prompts_change_logs
      @activity.prompts.map { |prompt|
        prompt_logs = prompt.change_logs || []
        logs = prompt_logs + automl_change_logs(prompt) + rules_change_logs(prompt)
      }.flatten
    end

    def automl_change_logs(prompt)
      prompt.automl_models.map(&:change_logs).flatten || []
    end

    def rules_change_logs(prompt)
      prompt.rules.reject { |rule| rule.universal_rule_type? }.map { |rule|
        rule_logs = rule.change_logs || []
        logs = rule_logs + feedbacks_change_logs(rule) + regex_rules_change_logs(rule) + plagiarism_texts_change_logs(rule)
      }.flatten! || []
    end

    def plagiarism_texts_change_logs(rule)
      rule.plagiarism_texts.map(&:change_logs).flatten! || []
    end

    def feedbacks_change_logs(rule)
      rule.feedbacks.map {|f|
        (f.change_logs || []) + highlights_change_logs(f)
      }.flatten! || []
    end

    def highlights_change_logs(feedback)
      feedback.highlights.map(&:change_logs).flatten! || []
    end

    def regex_rules_change_logs(rule)
      rule.regex_rules.map(&:change_logs).flatten! || []
    end
  end
end
