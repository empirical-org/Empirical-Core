namespace :add_user_id_to_units do
  desc 'assign existing units the correct user_id'
  task :update => :environment do
    Unit.unscoped.where(user_id: nil).each do |unit|
      classroom_activities = unit.classroom_activities
      if classroom_activities.any?
        ca_with_teacher = classroom_activities.find{ |ca| ca.classroom && ca.classroom.teacher }
        if ca_with_teacher
          unit.update(user_id: ca_with_teacher.classroom.teacher.id)
        end
      end
    end
    puts "we're done!!!!"
  end
end
