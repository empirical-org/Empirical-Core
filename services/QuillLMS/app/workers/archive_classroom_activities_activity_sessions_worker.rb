class ArchiveClassroomActivitiesActivitySessionsWorker
  include Sidekiq::Worker

  def perform(id)
    @class_act = ClassroomActivity.unscoped.find id
    @class_act.activity_sessions.each do |act_sesh|
      act_sesh.update(visible: false)
    end
  end
end
