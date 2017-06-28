class Api::V1::ClassroomActivitiesController < Api::ApiController
  include QuillAuthentication
  before_filter :authorize!

  def student_names
    get_assigned_student_hash
    render json: @assigned_student_hash
  end

  private

  def authorize!
    @classroom_activity = ClassroomActivity.find params[:id]
    if @classroom_activity.classroom.teacher != current_user then auth_failed end
  end

  def get_assigned_student_hash
    activity_sessions = @classroom_activity.activity_sessions.includes(:user)
    @assigned_student_hash = {}
    activity_sessions.each do |act_sesh|
      @assigned_student_hash[act_sesh.id] = act_sesh.user.name
    end
  end


end
