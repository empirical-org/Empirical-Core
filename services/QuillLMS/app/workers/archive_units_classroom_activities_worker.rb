class ArchiveUnitsClassroomActivitiesWorker
  include Sidekiq::Worker

  def perform(id)
    @unit = Unit.unscoped.find id
    @unit.classroom_activities.each do |class_act|
      class_act.update(visible: false)
      ArchiveClassroomActivitiesActivitySessionsWorker.perform_async(class_act.id)
    end
  end

end
