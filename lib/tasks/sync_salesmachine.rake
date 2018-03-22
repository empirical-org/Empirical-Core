desc "Sync teacher and school attributes with salesmachine"
task :sync_salesmachine => :environment do
  puts "Queueing sync workers:"

  school_ids = []

  School.distinct
    .joins(:users)
    .where('users.role = ?', 'teacher')
    .find_each do |school|
      school_ids << school.id

      if school_ids.length == 100
        SyncSalesAccountWorker.perform_async(school_ids)
        school_ids = []
      end
    end

  teacher_ids = []

  User.joins(:school).where('users.role = ?', 'teacher').find_each do |teacher|
    teacher_ids << teacher.id

    if teacher_ids.length == 100
      SyncSalesContactWorker.perform_async(teacher_ids)
      teacher_ids = []
    end
  end
end
