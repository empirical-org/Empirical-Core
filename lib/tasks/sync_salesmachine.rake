desc "Sync teacher and school attributes with salesmachine"
task :sync_salesmachine => :environment do
  puts "Queueing sync workers:"

  School.distinct
    .joins(:users)
    .where('users.role = ?', 'teacher')
    .find_each do |school|
      puts "School.id = #{school.id}"
      data = SerializeSalesAccount.new(school.id).data
      $smclient.account(data)
    end

  User.joins(:school).where('users.role = ?', 'teacher')
    .find_each do |teacher|
      puts "User.id = #{teacher.id}"
      data = SerializeSalesContact.new(teacher.id).data
      $smclient.contact(data)
    end
end
