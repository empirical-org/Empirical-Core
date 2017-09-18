class UpdateMilestonesWorker
  include Sidekiq::Worker

  def perform(activity_session_uid)
    activity_session = ActivitySession.find_by_uid(activity_session_uid)
    return unless activity_session
    # more milestones can be added here as relevant, for now this just checks to see if a Completed Diagnostic milestone needs to be created
    if activity_session.state == 'finished' && activity_session.classroom_activity_id && activity_session.classroom_activity.activity.activity_classification_id === 4
      teacher_milestones = activity_session.classroom_activity.unit.user.milestones
      if !teacher_milestones.find_by(name: 'Complete Diagnostic')
        teacher_milestones.push(Milestone.find_by(name: 'Complete Diagnostic'))
      end
    end
  end
end
