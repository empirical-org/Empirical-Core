namespace :classroom_activities do
  desc 'find archived units and archive their classroom activities and sessions'

  task :delete_if_missing_unit  => :environment do
    hidden_units = Unit.unscoped.where(visible: false)
    hidden_units.each {|unit| ArchiveUnitsClassroomActivitiesWorker.perform_async(unit.id)}
  end
  
end
