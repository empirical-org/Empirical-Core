namespace :users do
  task clear_data_on_deleted_user: :environment do
    User.deleted_users.find_each(&:clear_data)
  end
end