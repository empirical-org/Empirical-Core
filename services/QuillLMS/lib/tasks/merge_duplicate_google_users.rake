namespace :merge_duplicate_google_users do
  desc 'merge duplicate google users '

  task :create => :environment do
    merge_users
  end

  def merge_users
    duplicate_accounts.all.each do |user|
      # find students with most activities completed
      students_with_most_activities = []
      max_count = 0
      users = User.where(google_id: user.id)
      users.all.each do |duplicate|
        current_count = ActivitySession.where(user_id: duplicate.id, is_final_score: true).count
        if current_count > max_count
          max_count = current_count
          students_with_most_activities.push(duplicate)
        end
      end
      puts max_count

      # merge students that share the same classroom_id
      students_with_most_activities.all.each do |max_student|
        max_student_classroom_id = ClassroomUnit.where(":student_id = ANY(assigned_student_ids)", student_id:max_student.id).first.classroom_id

        current_student = User.where(google_id: max_student.id)
        if current_student.id != max_student.id
          duplicate_student_classroom_id = ClassroomUnit.where(":student_id = ANY(assigned_student_ids)", student_id:current_student.id).first.classroom_id

          if max_student_classroom_id == duplicate_student_classroom_id
            max_student.merge_student_account.(current_student)
          end
        end
      end  
    end
    puts 'Rake Task Completed'
  end

end
