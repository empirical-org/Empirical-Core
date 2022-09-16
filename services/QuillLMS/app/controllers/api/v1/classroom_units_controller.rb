# frozen_string_literal: true

class Api::V1::ClassroomUnitsController < Api::ApiController
  before_action :authorize!

  def student_names
    activity          = Activity.find_by(uid: params[:activity_id])
    activity_sessions = ActivitySession.includes(:user).where(
      activity: activity,
      classroom_unit_id: params[:classroom_unit_id]
    )

    render json: assigned_students(activity_sessions)
  end

  def teacher_and_classroom_name
    classroom_unit = ClassroomUnit.find(params[:classroom_unit_id])
    render json: classroom_unit.teacher_and_classroom_name
  end

  def finish_lesson
    activity = Activity.find_by_id_or_uid(params[:activity_id])
    classroom_unit = ClassroomUnit.find(params[:classroom_unit_id])

    unit_activity = UnitActivity.find_by(
      unit_id: classroom_unit.unit_id,
      activity_id: activity.id
    )

    states = ClassroomUnitActivityState.where(
      classroom_unit_id: params[:classroom_unit_id],
      unit_activity: unit_activity
    )

    data = params[:edition_id] ? { edition_id: params[:edition_id] } : {}

    activity_sessions = ActivitySession.unscoped.where(classroom_unit_id: params[:classroom_unit_id], activity_id: activity.id)

    ActivitySession.mark_all_activity_sessions_complete(
      activity_sessions,
      data
    )

    states.update_all(locked: true, pinned: false, completed: true)

    concept_results = concept_result_params[:concept_results].map(&:to_h)

    delete_activity_sessions_for_absent_students(activity_sessions, concept_results)

    ActivitySession.save_concept_results(
      activity_sessions,
      concept_results
    )

    ActivitySession.save_timetracking_data_from_active_activity_session(
      activity_sessions
    )

    if params[:edition_id]
      milestone = Milestone.find_by_name('Complete Customized Lesson')
      if !UserMilestone.find_by(user_id: current_user.id, milestone_id: milestone.id)
        UserMilestone.create(user_id: current_user.id, milestone_id: milestone.id)
      end
    end

    follow_up_unit_activity = begin
      if params[:follow_up].present?
        ActivitySession.assign_follow_up_lesson(
          params[:classroom_unit_id],
          params[:activity_id]
        )
      else
        false
      end
    end

    url = begin
      if follow_up_unit_activity.present?
        ActivitySession.generate_activity_url(
          params[:classroom_unit_id],
          follow_up_unit_activity.activity_id
        )
      else
        (ENV['DEFAULT_URL']).to_s
      end
    end

    render json: { follow_up_url: url }
  end

  def unpin_and_lock_activity
    activity = Activity.find_by_id_or_uid(params[:activity_id])
    classroom_unit = ClassroomUnit.find(params[:classroom_unit_id])
    unit_activity = UnitActivity.find_by(
      unit_id: classroom_unit.unit_id,
      activity: activity
    )
    state = ClassroomUnitActivityState.find_by(
      classroom_unit_id: params[:classroom_unit_id],
      unit_activity: unit_activity
    )
    state.update(pinned: false, locked: true)
    render json: state.pinned
  end

  def classroom_teacher_and_coteacher_ids
    classroom_unit = ClassroomUnit.find(params[:classroom_unit_id])

    teacher_ids = classroom_unit.try(&:classroom).try(&:teacher_ids)
    if teacher_ids
      teacher_ids_h = teacher_ids.collect { |item| [item, true] }.to_h
    end
    render json: {teacher_ids: teacher_ids_h || {}}
  end

  private def authorize!
    classroom_unit = ClassroomUnit.find(params[:classroom_unit_id])
    classroom_teacher!(classroom_unit&.classroom&.id)
  end

  private def assigned_students(activity_sessions)
    assigned_student_hash = {}
    assigned_student_ids_hash = {}

    activity_sessions.each do |activity_session|
      if activity_session.uid
        assigned_student_hash[activity_session.uid] = activity_session.user.name
      end
      if activity_session.user_id
        assigned_student_ids_hash[activity_session.user_id] = true
      end
    end

    {
      activity_sessions_and_names: assigned_student_hash,
      student_ids: assigned_student_ids_hash
    }
  end

  private def concept_result_params
    params.permit(
      concept_results: [
        :activity_session_uid,
        :concept_id,
        :question_type,
        metadata: [
          :activity_session_uid,
          :answer,
          :attemptNumber,
          :correct,
          :directions,
          :prompt,
          :questionNumber
        ]
      ]
    )
  end

  private def delete_activity_sessions_for_absent_students(activity_sessions, concept_results)
    # The incoming ActivitySession payload that reaches this controller from the
    # front-end includes ActivitySessions for students assigned to take the Lesson
    # who didn't show up.  For students who "miss" a Lesson in this manner, we mark
    # that by deleting their related ActivitySession.  So if a student submitted no
    # ConceptResults, we delete their ActivitySession for reporting purposes.
    activity_session_uids = activity_sessions.map(&:uid)
    activity_session_uids_with_concept_results = concept_results.map{ |cr| cr[:activity_session_uid] }.uniq
    activity_session_uids_without_concept_results = activity_session_uids - activity_session_uids_with_concept_results
    ActivitySession.where(uid: activity_session_uids_without_concept_results).destroy_all
  end
end
