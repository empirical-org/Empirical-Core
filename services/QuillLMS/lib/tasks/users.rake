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
end
