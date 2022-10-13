# frozen_string_literal: true

namespace :create_initial_change_log_for_evidence_activities do
  desc 'create change log for all Evidence activities with no initial version'
  task :run => :environment do
    Evidence::Activity.all.each do |activity|
      initial_version = Evidence.change_log_class.where(changed_record_id: activity.id, changed_attribute: 'version', changed_record_type: 'Evidence::Activity').length == 0
      if initial_version
        changelog_params = {
          action: Evidence.change_log_class::EVIDENCE_ACTIONS[:create],
          changed_record_type: 'Evidence::Activity',
          changed_record_id: activity.id,
          explanation: "Activity Created",
          changed_attribute: 'version',
          previous_value: "0",
          new_value: "1",
          created_at: activity.created_at,
          updated_at: activity.created_at
        }
        Evidence.change_log_class.create!(changelog_params)
      end
    end
  end
end
