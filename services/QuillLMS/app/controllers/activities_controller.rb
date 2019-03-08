class ActivitiesController < ApplicationController
  before_action :activity, only: [:update]
  before_filter :set_activity_by_lesson_id, only: [:preview_lesson]
  before_filter :set_activity, only: [:supporting_info, :customize_lesson, :name_and_id, :last_unit_template]

  def search
    search_result = $redis.get("default_#{flag ? flag + '_' : nil}activity_search") || custom_search
    render json: search_result
  end

  def count
    @count = Activity.where(flags: [:production]).count
    render json: {count: @count}
  end

  def diagnostic
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
      redirect_to "#{ENV['DEFAULT_URL']}/tutorials/lessons?url=#{URI.escape(preview_url)}"
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

protected

  def set_activity
    @activity = Activity.find_by(uid: params[:id]) || Activity.find_by(id: params[:id])
  end

  def set_activity_by_lesson_id
    @activity = Activity.find_by_id_or_uid(params[:lesson_id])
  end

  def user_completed_view_lessons_tutorial?
    !!Milestone.find_by(name: 'View Lessons Tutorial').users.include?(current_user)
  end

  def preview_url
    @url ||= "#{@activity.classification_form_url}teach/class-lessons/#{@activity.uid}/preview"
  end

  def custom_search
    substring = flag ? flag + "_" : ""
    activity_search_results = $redis.get("default_#{substring}activity_search")
    unless activity_search_results
      activity_search_results = JSON.parse(ActivitySearchWrapper.set_and_return_search_cache_data(flag))
    end
    activity_search_results
  end

  def activity
    @activity ||= Activity.find_by_id_or_uid(params[:id])
  end

  def search_params
    params.require(:search).permit([:search_query, {sort: [:field, :asc_or_desc]},  {filters: [:field, :selected]}])
  end

  def flag
    if current_user
      if current_user.role == 'staff'
        return 'private'
      elsif current_user.testing_flag
        return current_user.testing_flag
      end
    end
  end

end
