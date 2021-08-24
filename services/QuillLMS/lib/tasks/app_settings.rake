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

  desc 'Updates user allow list for existing AppSetting with inline args.'
  # Example usage: rake 'app_settings:update_user_ids_allow_list[theName, a@b.com 4 5]'
  task :update_user_ids_allow_list, [:name, :user_ids_allow_list] => :environment do |t, args|
    app_setting = AppSetting.find_by_name!(args[:name])
    user_ids = args[:user_ids_allow_list].split(' ')
    app_setting.update!(user_ids_allow_list: user_ids)
    puts "AppSetting #{app_setting.name} has been updated with user list: #{user_ids}."
  end

  desc 'Updates user allow list for existing AppSetting from file with emails.'
  # Example usage: rake 'app_settings:update_user_ids_allow_list_from_file_by_email[theName, filename]'
  task :update_user_ids_allow_list_from_file_by_email, [:name, :filename] => :environment do |t, args|
    emails = File.open(args[:filename]).read.split(' ')
    user_ids = emails.map {|e| User.find_by_email!(e).id}

    app_setting = AppSetting.find_by_name!(args[:name])

    app_setting.update!(user_ids_allow_list: user_ids)
    puts "AppSetting #{app_setting.name} has been updated with user list: #{user_ids}."
  end
end
