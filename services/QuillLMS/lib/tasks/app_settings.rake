namespace :app_settings do
  desc 'Creates a new AppSetting.'
  # Example usage: rake 'app_settings:create[theName,true,true,50,[]]'
  task :create, [:name, :enabled, :enabled_for_admins, :percent_active, :user_ids_allow_list] => :environment do |t, args|
    app_setting = AppSetting.create!(
      name: args[:name],
      enabled: args[:enabled],
      enabled_for_admins: args[:enabled_for_admins],
      percent_active: args[:percent_active],
      user_ids_allow_list: args[:user_ids_allow_list]
    )
    puts "AppSetting with name #{app_setting.name} created."
  end

  desc 'Updates user allow list for existing AppSetting.'
  # Example usage: rake 'app_settings:updateUserIdsAllowList[theName, 4 5]'
  task :updateUserIdsAllowList, [:name, :user_ids_allow_list] => :environment do |t, args|
    app_setting = AppSetting.find_by_name(args[:name])
    user_ids = args[:user_ids_allow_list].split(' ').map(&:to_i)
    app_setting.update!(user_ids_allow_list: user_ids)
    puts "AppSetting #{app_setting.name} has been updated with user list: #{user_ids}."
  end
end
