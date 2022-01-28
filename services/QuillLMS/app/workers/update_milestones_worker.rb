# frozen_string_literal: true

class UpdateMilestonesWorker
  include Sidekiq::Worker

  # rubocop:disable Metrics/CyclomaticComplexity
  def perform(activity_session_uid)
    activity_session = ActivitySession.find_by_uid(activity_session_uid)
    return unless activity_session
    # more milestones can be added here as relevant, for now this just checks to see if a Completed Diagnostic milestone needs to be created

    return unless activity_session.state == 'finished'
    return unless activity_session.classroom_unit_id
    return unless activity_session.activity.activity_classification_id == 4

    teacher_milestones = activity_session&.classroom_unit&.unit&.user&.milestones
    return unless teacher_milestones
    return if teacher_milestones.find_by(name: 'Complete Diagnostic')

    teacher_milestones.push(Milestone.find_by(name: 'Complete Diagnostic'))
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
