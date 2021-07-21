module Comprehension
  module FetchChangeLogs
    include Comprehension::ChangeLog
    UNIVERSAL_RULE_ACTIONS = ['Universal Rule - updated', 'Universal Rule - created']

    def change_logs_for_activity(activity)
      @activity = activity
      @change_log = Comprehension.change_log_class
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
      @change_log.where(action: UNIVERSAL_RULE_ACTIONS).map(&:attributes) || []
    end

    def activity_change_logs
      @change_log.where(changed_record_type: 'Comprehension::Activity', changed_record_id: @activity.id).map(&:attributes) || []
    end

    def passages_change_logs
      @activity.passages.map { |passage| @change_log.where(changed_record_type: 'Comprehension::Passage', changed_record_id: passage.id).map(&:attributes)}.flatten! || []
    end

    def prompts_change_logs
      @activity.prompts.map { |prompt|
        prompt_logs = @change_log.where(changed_record_type: 'Comprehension::Prompt', changed_record_id: prompt.id).map(&:attributes)
        logs = prompt_logs + automl_change_logs(prompt) + rules_change_logs(prompt)
        logs.map { |log|
          log.merge({conjunction: prompt.conjunction})
        }
      }.flatten || []
    end

    def automl_change_logs(prompt)
      prompt.automl_models.map {|a| @change_log.where(changed_record_type: 'Comprehension::AutomlModel', changed_record_id: a.id).map {|cl| cl.attributes.merge({name: a.name})}}.flatten! || []
    end

    def rules_change_logs(prompt)
      prompt.rules.map { |rule|
        logs = label_change_logs(rule) + feedbacks_change_logs(rule) + regex_rules_change_logs(rule) + plagiarism_text_change_logs(rule)
        logs.map {|log|
          log.merge({name: rule.name})
        }
      }.flatten! || []
    end

    def plagiarism_text_change_logs(rule)
      @change_log.where(changed_record_type: 'Comprehension::PlagiarismText', changed_record_id: rule.plagiarism_text&.id).map(&:attributes) || []
    end

    def label_change_logs(rule)
      @change_log.where(changed_record_type: 'Comprehension::Label', changed_record_id: rule.label&.id).map(&:attributes) || []
    end

    def feedbacks_change_logs(rule)
      rule.feedbacks.map {|f|
        @change_log.where(changed_record_type: 'Comprehension::Feedback', changed_record_id: f.id)
          .map(&:attributes) + highlights_change_logs(f)
      }.flatten! || []
    end

    def highlights_change_logs(feedback)
      feedback.highlights.map {|h| @change_log.where(changed_record_type: 'Comprehension::Highlight', changed_record_id: h.id).map(&:attributes)}.flatten! || []
    end

    def regex_rules_change_logs(rule)
      rule.regex_rules.map {|rr| @change_log.where(changed_record_type: 'Comprehension::RegexRule', changed_record_id: rr.id).map(&:attributes)}.flatten! || []
    end
  end
end
