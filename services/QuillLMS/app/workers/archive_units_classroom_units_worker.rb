class ArchiveUnitsClassroomUnitsWorker
  include Sidekiq::Worker

  def perform(id)
    @unit = Unit.unscoped.find id
    @unit.classroom_units.each do |class_unit|
      class_unit.update(visible: false)
      ArchiveClassroomUnitsActivitySessionsWorker.perform_async(class_unit.id)
    end
  end

end
