# frozen_string_literal: true

require_relative '../progress_bar'

namespace :students do
  task remove_users_with_same_email: :environment do

    duplicate_emails = User.student.where.not(email: [nil, ""]).group(:email).having("count(email) > 1").pluck(:email)

    progress_bar = ProgessBar.new(duplicate_emails.size)

    duplicate_emails.each do |email|
      User.find_by(email: email).duplicate_empty_student_accounts.destroy_all
      progress_bar.increment
    end
  end
end
