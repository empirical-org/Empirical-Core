class ActivitiesController < ApplicationController
  before_action :activity, only: [:update]

  def search
    if any_search_params
      search_result = custom_search
    else
      search_result = $redis.get('default_activity_search') || custom_search
    end
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

protected

  def any_search_params
    # case
    # when search_params["search_query"] != ''
    #   return true
    # when search_params["filters"]["0"]["selected"] != ''
    #   return true
    # when search_params["filters"]["1"]["selected"] != ''
    #   return true
    # when search_params["filters"]["2"]["selected"] != ''
    #   return true
    # when search_params["sort"].present?
    #   return true
    # when current_user.flag.present?
    #   return true
    # else
    #   return false
    # end
  end

  def custom_search
    unless any_search_params
      Activity.set_activity_search_cache
    end
    ActivitySearchWrapper.new(search_params[:search_query], search_params[:filters], search_params[:sort], current_user.flag, current_user.id).search
  end

  def activity
    @activity ||= Activity.find(params[:id])
  end

  def search_params
    params.require(:search).permit([:search_query, {sort: [:field, :asc_or_desc]},  {filters: [:field, :selected]}])
  end

end
