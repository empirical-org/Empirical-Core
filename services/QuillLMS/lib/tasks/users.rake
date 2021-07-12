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
end