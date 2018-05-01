class ActivitiesController < ApplicationController
  before_action :activity, only: [:update]

  def search
    search_result = $redis.get("default_#{current_user.testing_flag ? current_user.testing_flag + '_' : nil}activity_search") || custom_search
    render json: search_result
  end

  def count
    @count = Activity.where(flags: [:production]).count
    render json: {count: @count}
  end

  def diagnostic
    render 'pages/diagnostic'
  end

  def preview_lesson
    lesson = Activity.find_by(id: params[:lesson_id]) || Activity.find_by(uid: params[:lesson_id])
    base_route = lesson.classification.form_url
    preview_url = "#{base_route}teach/class-lessons/#{lesson.uid}/preview"
    if current_user
      completed = !!Milestone.find_by(name: 'View Lessons Tutorial').users.include?(current_user)
      if completed
        redirect_to preview_url
      else
        redirect_to "#{ENV['DEFAULT_URL']}/tutorials/lessons?url=#{URI.escape(preview_url)}"
      end
    else
      redirect_to preview_url
    end
  end

  def supporting_info
    activity = Activity.find_by(id: params[:id]) || Activity.find_by(uid: params[:id])
    if activity.supporting_info
      redirect_to activity.supporting_info
    end
  end

  def customize_lesson
    activity = Activity.find_by(id: params[:id]) || Activity.find_by(uid: params[:id])
    base_url = activity.classification.form_url
    redirect_to "#{base_url}customize/#{activity.uid}"
  end

protected

  def custom_search
    flag = current_user.testing_flag
    substring = flag ? flag + "_" : ""
    activity_search_results = $redis.get("default_#{substring}activity_search")
    unless activity_search_results
      activity_search_results = JSON.parse(ActivitySearchWrapper.set_and_return_search_cache_data(current_user.testing_flag))
    end
    activity_search_results
  end

  def activity
    @activity ||= Activity.find(params[:id])
  end

  def search_params
    params.require(:search).permit([:search_query, {sort: [:field, :asc_or_desc]},  {filters: [:field, :selected]}])
  end

end
