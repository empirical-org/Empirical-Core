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
    asw = ActivitySearchWrapper.new(search_params[:search_query], search_params[:filters], search_params[:sort])
    asw.search
    render json: asw.result
  end

  def count
    @count = Activity.where(flags: [:production]).count
    render json: {count: @count}
  end

  def diagnostic
    render 'pages/diagnostic'
  end

protected

  def activity
    @activity ||= Activity.find(params[:id])
  end

  def search_params
    params.require(:search).permit([:search_query, {sort: [:field, :asc_or_desc]},  {filters: [:field, :selected]}])
  end

end
