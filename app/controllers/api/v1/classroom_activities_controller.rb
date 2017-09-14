class Api::V1::ClassroomActivitiesController < Api::ApiController
  include QuillAuthentication
  before_filter :authorize!

  def student_names
    get_assigned_student_hash
    render json: @assigned_student_hash
  end

  def teacher_and_classroom_name
    render json: @classroom_activity.teacher_and_classroom_name
  end

  def finish_lesson
    @classroom_activity.mark_all_activity_sessions_complete
    @classroom_activity.update(locked: true, pinned: false)
    follow_up = JSON.parse(params['json'])['follow_up'] ? @classroom_activity.assign_follow_up_lesson(false) : false
    url = follow_up ? "#{ENV['DEFAULT_URL']}/teachers/classroom_activities/#{follow_up&.id}/activity_from_classroom_activity" : "#{ENV['DEFAULT_URL']}"
    render json: {follow_up_url: url}
  end

  def pin_activity
    @classroom_activity.update(pinned: true)
    render json: @classroom_activity.pinned
  end

  def unpin_activity
    @classroom_activity.update(pinned: false)
    render json: @classroom_activity.pinned
  end

  private

  def authorize!
    @classroom_activity = ClassroomActivity.find params[:id]
    class_act_teacher = @classroom_activity&.classroom&.teacher
    if !class_act_teacher || class_act_teacher != current_user then auth_failed end
  end

  def get_assigned_student_hash
    activity_sessions = @classroom_activity.activity_sessions.includes(:user)
    @assigned_student_hash = {}
    activity_sessions.each do |act_sesh|
      @assigned_student_hash[act_sesh.id] = act_sesh.user.name
    end
  end


end
