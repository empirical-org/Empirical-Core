# frozen_string_literal: true

namespace :app_settings do
  desc 'Creates a new AppSetting.'
  # Example usage: rake 'app_settings:create[theName,true,true,50,[]]'
  task :create, [:name, :enabled, :enabled_for_staff, :percent_active, :user_ids_allow_list] => :environment do |t, args|
    app_setting = AppSetting.create!(
      name: args[:name],
      enabled: args[:enabled],
      enabled_for_staff: args[:enabled_for_staff],
      percent_active: args[:percent_active],
      user_ids_allow_list: args[:user_ids_allow_list]
    )
    puts "AppSetting with name #{app_setting.name} created."
  end

  desc 'Updates user allow list for existing AppSetting from a CSV file.'
  # Example usage: rake 'app_settings:update_user_ids_allow_list_from_csv[theName, filename]'
  task :update_user_ids_allow_list_from_csv, [:name, :filename] => :environment do |t, args|
    iostream = File.read(args[:filename])
    if (CSV.parse(iostream, headers: true).headers & ["email", "flag"]).count != 2
      puts "Invalid headers. Exiting."
      exit 1
    end

    emails = CSV.parse(iostream, headers: true).map { |row| row['email'] }
    user_ids = emails.map do |email|
      user = User.find_by_email(email)
      if !user
        puts "User with email #{email} not found"
        next
      end
      user.id
    end.compact

    app_setting = AppSetting.find_by_name!(args[:name])

    app_setting.update!(user_ids_allow_list: app_setting.user_ids_allow_list.concat(user_ids).uniq)
    puts "AppSetting #{app_setting.name} has been updated with user list: #{user_ids}."
  end

  # Example usage: rake 'remove_user_ids_from_allow_list[theName, filename]'
  # This task uses ids instead of emails, since some users do not have emails
  task :remove_user_ids_from_allow_list, [:name, :filename] => :environment do |t, args|
    iostream = File.read(args[:filename])
    if (CSV.parse(iostream, headers: true).headers & ["id"]).count != 1
      puts "Invalid headers. Exiting."
      exit 1
    end

    removable_user_ids = CSV.parse(iostream, headers: true).map { |row| row['id'] }.map(&:to_i)

    app_setting = AppSetting.find_by_name!(args[:name])

    app_setting.update!(user_ids_allow_list: app_setting.user_ids_allow_list - removable_user_ids)
    puts "AppSetting #{app_setting.name} has been updated with these users removed: #{removable_user_ids}."
  end
end
