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
end