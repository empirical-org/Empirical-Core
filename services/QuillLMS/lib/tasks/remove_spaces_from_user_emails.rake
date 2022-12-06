# frozen_string_literal: true

namespace :user_emails do
  desc 'Remove spaces from user emails'
  task :remove_spaces => :environment do
    users_with_spaces = User.where("email ILIKE '% %'")
    users_with_spaces.each do |user|
      previous_value = user.email
      if user.update(email: previous_value.gsub(/\s/, ''))
        ChangeLog.create(
          action: ChangeLog::USER_ACTIONS[:update],
          changed_attribute: :email,
          changed_record: user,
          explanation: 'Removing spaces from emails',
          previous_value: previous_value
        )
      elsif user.username && user.update(email: nil)
        ChangeLog.create(
          action: ChangeLog::USER_ACTIONS[:update],
          changed_attribute: :email,
          changed_record: user,
          explanation: 'Removing emails where they included a space, the version of the email without the space was not saveable, and there was a username',
          previous_value: previous_value
        )
      end
    end
  end
end
