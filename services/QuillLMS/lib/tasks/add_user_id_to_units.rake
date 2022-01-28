# frozen_string_literal: true

namespace :add_user_id_to_units do
  desc 'assign existing units the correct user_id'
  task :update => :environment do

   # if we ever start allowing users to restore units they've archived,
   # this will need to be updated

   Unit.where(user_id: nil).each do |unit|
    classroom_activities = ClassroomActivity.unscoped.where(unit_id: unit.id)
    if classroom_activities.any?
      teacher = nil
      ca_with_teacher = classroom_activities.find do |ca|
        classy = Classroom.unscoped.find_by_id(ca.classroom_id)
        teacher = User.find_by_id(classy.teacher_id) if classy
        classy && teacher
      end
      if ca_with_teacher
        unit.update_attribute('user_id', teacher.id)
        puts 'unit_id'
        puts unit.id
      end
    end
  end

 end
end
