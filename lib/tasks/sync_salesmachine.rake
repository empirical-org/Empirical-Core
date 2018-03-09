desc "Sync teacher and school attributes with salesmachine"
task :sync_salesmachine => :environment do
  puts "Queueing sync workers:"

  School.distinct
    .joins(:users)
    .where('users.role = ?', 'teacher')
    .find_each do |school|
      SyncSalesmachineAccountWorker.perform_async(school.id)

      puts "school_id: #{school.id}"

      school.users.teacher.each do |teacher|
        SyncSalesmachineContactWorker.perform_async(teacher.id)

        puts " -- teacher_id: #{teacher.id}"
      end
    end

  puts "Done"
end
