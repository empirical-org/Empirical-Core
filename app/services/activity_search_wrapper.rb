class ActivitySearchWrapper
  RESULTS_PER_PAGE = 12

  def initialize(search_query='', filters={}, sort=nil, flag=nil, user_id=nil)
    @search_query = search_query
    @filters = process_filters(filters)
    @sort = sort
    @activities = nil
    @activity_classifications = []
    @topics = []
    @topic_categories = []
    @sections = []
    @number_of_pages = nil
    @flag = flag
    @user_id = user_id
  end

  def search
    if @user_id
      ActivitySearchAnalyticsWorker.perform_async(@user_id, @search_query)
    end
    get_custom_search_results
    search_result
  end

  def search_result
    {
      activities: @activities,
      activity_classifications: @activity_classifications,
      topic_categories: @topic_categories,
      sections: @sections,
      number_of_pages: @number_of_pages
    }
  end

  private

  def process_filters(filters)
    filter_fields = [:activity_classifications, :topic_categories, :sections]
    filters.reduce({}) do |acc, filter|
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

  def get_custom_search_results
    get_activity_search
    get_activity_classifications
    get_topics_topic_categories_and_sections
    get_formatted_search_results
  end

  def get_activity_search
    @activities = ActivitySearch.search(@search_query, @filters, @sort, @flag)
  end

  def get_formatted_search_results
    @number_of_pages = (@activities.count.to_f/RESULTS_PER_PAGE.to_f).ceil
    @activities = @activities.map{|a| (ActivitySerializer.new(a)).as_json(root: false)}
  end

  def get_activity_classifications
    activity_classifications = @activities.map(&:classification).uniq.compact
    @activity_classifications = activity_classifications.map{|c| ClassificationSerializer.new(c).as_json(root: false)}
  end

  def get_topics_topic_categories_and_sections
    @topics = @activities.includes(topic: :topic_category).map(&:topic).uniq.compact
    @topic_categories = @topics.map(&:topic_category).uniq.compact
    @sections = @topics.map(&:section).uniq.compact
  end

end
