class ActivitySearchWrapper
  RESULTS_PER_PAGE = 12

  def initialize(search_query='', filters={}, sort=nil, flag=nil, user_id=nil)
    @search_query = search_query
    @filters = process_filters(filters)
    @sort = sort
    @activities = nil
    @activity_classifications = []
    @topics = []
    @activity_categories = []
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
      activity_categories: @activity_categories,
      sections: @sections,
      number_of_pages: @number_of_pages
    }
  end

  private

  def process_filters(filters)
    filter_fields = [:activity_classifications, :activity_categories, :sections]
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
    get_activity_categories_classifications_topics_and_section
    get_formatted_search_results
  end

  def get_activity_search
    @activities = ActivitySearch.search(@search_query, @filters, @sort, @flag)
  end

  def get_formatted_search_results
    @number_of_pages = (@activities.count.to_f/RESULTS_PER_PAGE.to_f).ceil
    @activities = @activities.map do |a|
      a['classification'] = {id: a['classification_id']}
      a['activity_category'] = {id: a['activity_category_id'], name: a['activity_category_name']}
      a['topic'] = {section: {id: a['section_id'], name: a['section_name']}}
      a
    end
  end

  def get_activity_categories_classifications_topics_and_section
    topic_ids = []
    activity_classification_ids = []
    @activities.each do |a|
      topic_ids << a['topic_id']
      activity_classification_ids << a['activity_classification_id']
    end
    @activity_classifications = ActivityClassification.where(id: activity_classification_ids).map{|c| ClassificationSerializer.new(c).as_json(root: false)}
    @topics = Topic.where(id: topic_ids)
    @activity_categories = ActivityCategory.all
    section_ids = @topics.map(&:section_id).uniq
    @sections = Section.where(id: section_ids)
  end

end
