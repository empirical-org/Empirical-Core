namespace :handle_units_without_classroom_activities do
  desc 'destroy units with no teacher or classroom activities, hide otherwise'
  task :update => :environment do
    Unit.unscoped.all.each do |unit|
     classroom_activities = ClassroomActivity.where(unit_id: unit.id)
     if classroom_activities.empty?
       if ClassroomActivity.unscoped.where(unit_id: unit.id).empty? && unit.user_id.nil?
         unit.destroy
       else
         unit.update_attribute('visible', false)
       end
     end
   end

  end
end
