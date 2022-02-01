# frozen_string_literal: true

namespace :migrate_change_polymorphic_reference_namespace do
  desc 'Update all polymorphic relationship references to use the new Evidence:: namespace'
  task :run => :environment do
    CHANGE_LOG_ENGINE_MODELS = [
      'Activity',
      'Prompt',
      'Rule',
      'Passage',
      'AutomlModel',
      'Label',
      'Feedback',
      'Highlight',
      'RegexRule',
      'PlagiarismText'
    ]

    FeedbackHistory.update_all(prompt_type: FeedbackHistory::DEFAULT_PROMPT_TYPE)

    CHANGE_LOG_ENGINE_MODELS.each do |model_name|
      ChangeLog.where(changed_record_type: "Comprehension::#{model_name}").update_all(changed_record_type: "Evidence::#{model_name}")
    end
  end
end
