# frozen_string_literal: true

require_relative './progress_bar'

namespace :users do
  task clear_data_on_deleted_users: :environment do
    deleted_users = User.deleted_users

    progress_bar = ProgessBar.new(deleted_users.size)

    deleted_users.find_each do |user|
      user.clear_data
      progress_bar.increment
    end
  end

  task refresh_school_subscriptions: :environment do
    pipe_data = $stdin.read unless $stdin.tty?

    unless pipe_data
      puts 'No data detected on STDIN.  You must pass data to the task for it to run.  Example:'
      puts '  rake users:refresh_school_subscriptions < path/to/local/file.csv'
      puts ''
      puts 'If you are piping data into Heroku, you need to include the --no-tty flag:'
      puts '  heroku run rake users:refresh_school_subscriptions -a empirical-grammar --no-tty < path/to/local/file.csv'
      exit 1
    end

    CSV.parse(pipe_data, headers: true) do |row|
      user = User.find(row['user_id'])
      user.updated_school(user.school.id)
    rescue
      puts "Failed to update for user #{row['user_id']}"
    end
  end

  task update_admin_user_roles: :environment do
    User.joins(:schools_admins).where.not(role: User::ADMIN).distinct.each do |admin_user|
      admin_user.update(role: User::ADMIN)
    end
  end

  task mark_google_clever_admins_verified: :environment do
    User.left_outer_joins(:user_email_verification)
      .joins(:admin_info) # only users who self-service sign up as admins have AdminInfo records
      .where.not(clever_id: nil)
      .or(User.where.not(google_id: nil)) # the position of `or` matters a lot when you have multiple `where` clauses
      .where(role: User::ADMIN)
      .where(user_email_verification: { id: nil })
      .each do |user|

      verification_method = UserEmailVerification::GOOGLE_VERIFICATION if user.google_id
      verification_method = UserEmailVerification::CLEVER_VERIFICATION if user.clever_id
      user.verify_email(verification_method)
    end
  end
end
