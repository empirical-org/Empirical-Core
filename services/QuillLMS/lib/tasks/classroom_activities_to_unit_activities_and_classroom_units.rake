namespace :rewrite_classroom_activities do
  desc 'create unit activities and classroom units from classroom activities'

  task :create_unit_activities_and_classroom_units  => :environment do
    Unit.unscoped.find_each.with_index do |u, i|
      puts 'launching worker', i
      ClassroomActivitiesToUnitActivitiesAndClassroomUnitsWorker.perform_async(u.id)
    end
  end

end
