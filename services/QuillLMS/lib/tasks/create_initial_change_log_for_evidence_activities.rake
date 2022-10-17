# frozen_string_literal: true

namespace :create_initial_change_log_for_evidence_activities do
  desc 'create change log for all Evidence activities with no initial version'
  task :run => :environment do
    rake_task_user = User.find_or_create_by(name: 'Rake Robot', role: 'staff')
    Evidence::Activity.all.each do |activity|
      changelog_params = {
        action: Evidence.change_log_class::EVIDENCE_ACTIONS[:create],
        changed_record_type: 'Evidence::Activity',
        changed_record_id: activity.id,
        user_id: rake_task_user.id,
        explanation: "Activity Created",
        changed_attribute: 'version',
        previous_value: "0",
        new_value: "1",
        created_at: activity.created_at,
        updated_at: activity.created_at
      }

      change_logs = Evidence.change_log_class.where(changed_record_id: activity.id, changed_attribute: 'version', changed_record_type: 'Evidence::Activity')

      if change_logs.any?
        changes_logs.each do |change_log|
          change_log.previous_value = "#{change_log.previous_value.to_i + 1}"
          change_log.new_value = "#{change_log.new_value.to_i + 1}"
          change_log.save!
        end
      end

      activity.update_columns(version: activity.version + 1)
      Evidence.change_log_class.create!(changelog_params)
    end
  end
end
