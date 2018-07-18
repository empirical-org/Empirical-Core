class Api::V1::ClassroomActivitiesController < Api::ApiController
  include QuillAuthentication
  before_filter :authorize!
  before_filter :set_activity_sessions, only: :student_names

  def student_names
    render json: assigned_students
  end

  def teacher_and_classroom_name
    classroom_unit = ClassroomUnit.find(params[:classroom_unit_id])
    render json: classroom_unit.teacher_and_classroom_name
  end

  def finish_lesson
    json = JSON.parse(params['json'])
    data = json['edition_id'] ? {edition_id: json['edition_id']} : {}

    activity = Activity.find(params[:activity_id])
    classroom_unit = ClassroomUnit.find(params[:classroom_unit_id])

    unit_activity = UnitActivity.find_by(
      unit_id: classroom_unit.unit_id,
      activity_id: params[:activity_id]
    )

    states = ClassroomUnitActivityState.where(
      classroom_unit_id: params[:classroom_unit_id],
      unit_activity: unit_activity
    )

    ActivitySession.mark_all_activity_sessions_complete(
      params[:classroom_unit_id],
      params[:activity_id],
      data
    )

    states.update_all(locked: true, pinned: false, completed: true)

    ActivitySession.save_concept_results(
      params[:classroom_unit_id],
      params[:activity_id],
      json['concept_results']
    )

    ActivitySession.delete_activity_sessions_with_no_concept_results(
      params[:classroom_unit_id],
      params[:activity_id]
    )

    if json['edition_id']
      milestone = Milestone.find_by_name('Complete Customized Lesson')
      if !UserMilestone.find_by(user_id: current_user.id, milestone_id: milestone.id)
        UserMilestone.create(user_id: current_user.id, milestone_id: milestone.id)
      end
    end

    follow_up = begin
      if json['follow_up'].present?
        ActivitySession.assign_follow_up_lesson(
          params[:classroom_unit_id],
          params[:activity_id],
          false
        )
      else
        false
      end
    end

    url = begin
      if follow_up.present?
        ActivitySession.generate_activity_url(
          params[:classroom_unit_id],
          follow_up.id
        )
      else
        "#{ENV['DEFAULT_URL']}"
      end
    end

    render json: { follow_up_url: url }
  end

  def unpin_and_lock_activity
    @classroom_activity.update(pinned: false, locked: true)
    render json: @classroom_activity.pinned
  end

  def classroom_teacher_and_coteacher_ids
    teacher_ids = @classroom_activity.try(&:classroom).try(&:teacher_ids)
    if teacher_ids
      teacher_ids_h = Hash[teacher_ids.collect { |item| [item, true] } ]
    end
    render json: {teacher_ids: teacher_ids_h ? teacher_ids_h : {}}
  end

  private

  def set_activity_sessions
    @activity_sessions = ActivitySession.includes(:user).where(
      activity_id: params[:activity_id],
      classroom_unit_id: params[:classroom_unit_id]
    )
  end

  def authorize!
    classroom_unit = ClassroomUnit.find(params[:classroom_unit_id])
    classroom_teacher!(classroom_unit.classroom.id)
  end

  def assigned_students
    assigned_student_hash = {}
    assigned_student_ids_hash = {}

    @activity_sessions.each do |activity_session|
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
end
