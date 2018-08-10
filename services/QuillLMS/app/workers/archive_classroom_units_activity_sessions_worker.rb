class ArchiveClassroomUnitsActivitySessionsWorker
  include Sidekiq::Worker

  def perform(id)
    @class_unit = ClassroomUnit.unscoped.find id
    @class_unit.activity_sessions.each do |act_sesh|
      act_sesh.update(visible: false)
    end
  end




end
