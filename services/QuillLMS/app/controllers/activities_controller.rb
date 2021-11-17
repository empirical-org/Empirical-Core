class ActivitiesController < ApplicationController
  before_action :activity, only: [:update]
  before_action :set_activity_by_lesson_id, only: [:preview_lesson]
  before_action :set_activity, only: [:supporting_info, :customize_lesson, :name_and_id, :last_unit_template]
  before_action :student!, only: :activity_session

  DIAGNOSTIC = 'diagnostic'

  def search
    flag = params[:flag] || current_user&.testing_flag
    search_result = Activity.search_results(flag)
    render json: search_result.to_json
  end

  def count
    @count = Activity.where(flags: '{production}').count
    render json: {count: @count}
  end

  def diagnostic
    session[GOOGLE_REDIRECT] = request.env['PATH_INFO']
    render 'pages/diagnostic'
  end

  def name_and_id
    if @activity
      render json: { name: @activity.name, id: @activity.id }
    end
  end

  def last_unit_template
    if @activity
      unit_template = @activity.unit_templates&.last
      if unit_template
        render json: { name: unit_template.name, id: unit_template.id }
      else
        render json: {}
      end
    else
      render json: {}
    end
  end

  def preview_lesson
    if current_user && !user_completed_view_lessons_tutorial?
      redirect_to "#{ENV['DEFAULT_URL']}/tutorials/lessons?url=#{URI.encode_www_form_component(preview_url)}"
    else
      redirect_to preview_url
    end
  end

  def supporting_info
    if @activity.supporting_info
      redirect_to @activity.supporting_info
    end
  end

  def customize_lesson
    redirect_to "#{@activity.classification_form_url}customize/#{@activity.uid}"
  end

  def activity_session
    if current_user && current_user.role == "student"
      classroom_unit_id = params["classroom_unit_id"]
      if authorized_activity_access?
        redirect_to activity_session_from_classroom_unit_and_activity_path(classroom_unit, activity)
      elsif current_user && current_user.role == "student" && classroom_unit_id
        activity_link(classroom_unit_id: classroom_unit_id)
      else
        redirect_to classes_path
      end
    else
      redirect_to profile_path
    end
  end

  def activity_link(classroom_unit_id: nil)
    classroom_unit = classroom_unit_id && ClassroomUnit.find(classroom_unit_id)
    if current_user && current_user.role == "student"
      if classroom_unit && !classroom_unit.assigned_student_ids.include?(current_user.id)
        flash[:error] = 'Sorry, you do not have access to this activity because it has not been assigned to you. Please contact your teacher.'
        flash.keep(:error)
        redirect_to classes_path
      end
    else
      redirect_to profile_path
    end
  end

  private def authorized_activity_access?
    activity &&
    classroom_unit&.assigned_student_ids&.include?(current_user.id) &&
    UnitActivity.exists?(unit: classroom_unit.unit, activity: activity)
  end

  private def classroom_unit
    @classroom_unit ||= ClassroomUnit.find(params[:classroom_unit_id])
  end

  protected def set_activity
    @activity = Activity.find_by(uid: params[:id]) || Activity.find_by(id: params[:id])
  end

  protected def set_activity_by_lesson_id
    @activity = Activity.find_by_id_or_uid(params[:lesson_id])
  end

  protected def user_completed_view_lessons_tutorial?
    !!Milestone.find_by(name: 'View Lessons Tutorial').users.include?(current_user)
  end

  protected def preview_url
    @url ||= "#{@activity.classification_form_url}teach/class-lessons/#{@activity.uid}/preview"
  end

  protected def activity
    @activity ||= Activity.find_by_id_or_uid(params[:id])
  end

  protected def search_params
    params.require(:search).permit([:search_query, {sort: [:field, :asc_or_desc]},  {filters: [:field, :selected]}])
  end

end
