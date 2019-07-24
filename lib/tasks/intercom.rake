namespace :intercom do
  INACTIVE_SEGMENT_ID = '5a6f53b894948854ff51a165'
  desc 'deletes users from Intercom if they are in the above segment'
  task :delete_old_users do
    intercom = Intercom::Client.new(token: ENV['INTERCOM_ACCESS_TOKEN'])
    intercom.users.find_all({ segment_id: INACTIVE_SEGMENT_ID }).to_a.each do |user|
      intercom.users.delete(user)
    end
  end
end
