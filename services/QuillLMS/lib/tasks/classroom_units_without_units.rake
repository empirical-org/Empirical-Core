namespace :classroom_units do
  desc 'find archived units and archive their classroom units and sessions'

  task :delete_if_missing_unit  => :environment do
    hidden_units = Unit.unscoped.where(visible: false)
    hidden_units.each {|unit|
      ArchiveUnitsClassroomUnitsWorker.perform_async(unit.id)
      ArchiveUnitsUnitActivitiesWorker.perform_async(unit.id)
    }
  end

end
