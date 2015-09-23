class ActivitiesController < ApplicationController
  before_action :activity, only: [:update, :retry]
  RESULTS_PER_PAGE = 12


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
    @activities = Activity.search(search_params[:search_query], search_filters, search_params[:sort])
    @activity_classifications = @activities.map(&:classification).uniq.compact
    @activity_classifications = @activity_classifications.map{|c| ClassificationSerializer.new(c).as_json(root: false)}

    @topics = @activities.map(&:topic).uniq.compact
    @topic_categories = @topics.map(&:topic_category).uniq.compact
    @sections = @topics.map(&:section).uniq.compact

    @number_of_pages = (@activities.count.to_f/RESULTS_PER_PAGE.to_f).ceil
    @results_per_page = RESULTS_PER_PAGE
    @activities = @activities.map{|a| (ActivitySerializer.new(a)).as_json(root: false)}
    render json: {
      activities: @activities,
      activity_classifications: @activity_classifications,
      topic_categories: @topic_categories,
      sections: @sections,
      number_of_pages: @number_of_pages
    }
  end

protected

  def activity
    @activity ||= Activity.find(params[:id])
  end

  def search_filters
    filter_fields = [:activity_classifications, :topic_categories, :sections]
    search_params[:filters].reduce({}) do |acc, filter|
      filter_value = filter[1]
      # activityClassification -> activity_classifications
      # Just for the record, this is a terrible hacky workaround.
      model_name = filter_value['field'].to_s.pluralize.underscore.to_sym
      model_id = filter_value['selected'].to_i
      if filter_fields.include?(model_name) and !model_id.zero?
        acc[model_name] = model_id
      end
      acc
    end
  end

  def search_params
    params.require(:search).permit([:search_query, {sort: [:field, :asc_or_desc]},  {filters: [:field, :selected]}])
  end

end
