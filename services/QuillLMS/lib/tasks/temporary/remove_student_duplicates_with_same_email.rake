# frozen_string_literal: true

require_relative '../progress_bar'

namespace :students do
  desc 'Remove duplicate student users with same email'
  task remove_users_with_same_email: :environment do
    duplicate_emails =
      User
        .student
        .where
        .not(email: [nil, ""])
        .group(:email)
        .having("count(email) > 1")
        .pluck(:email)

    progress_bar = ProgessBar.new(duplicate_emails.size)

    [].tap do |ids_for_deletion|
      duplicate_emails.each do |email|
        student = User.find_by(email: email)
        ids_for_deletion << student.duplicate_student_accounts.pluck(:id)
        progress_bar.increment
      end

      User.where(id: ids_for_deletion).destroy_all
    end
  end
end
