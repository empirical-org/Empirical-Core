class ActivitiesController < ApplicationController
  before_action :activity, only: [:update, :retry]


  def retry
    redirect_to new_session_path if current_user.nil?


    @activity_session = ActivitySession.new(is_retry: true,
                                            user_id: current_user.id,
                                            activity_id: @activity.id,
                                            classroom_activity_id: params[:classroom_activity_id])
    @activity_session.start
    @activity_session.save!
    redirect_to play_activity_session_path(@activity_session)
  end

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

protected

  def any_search_params
    case
    when search_params["search_query"] != ''
      return true
    when search_params["filters"]["0"]["selected"] != ''
      return true
    when search_params["filters"]["1"]["selected"] != ''
      return true
    when search_params["filters"]["2"]["selected"] != ''
      return true
    when search_params["sort"].present?
      return true
    when current_user.flag.present?
      return true
    else
      return false
    end
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
