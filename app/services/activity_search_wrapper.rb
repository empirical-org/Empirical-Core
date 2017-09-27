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
      activity_id = a['activity_id'].to_i
      classification_id = a['classification_id'].to_i
      {
        name: a['activity_name'],
        description: a['activity_description'],
        flags: a['activity_flag'],
        id: activity_id,
        uid: a['activity_uid'],
        anonymous_path: Rails.application.routes.url_helpers.anonymous_activity_sessions_path(activity_id: activity_id),
        classification: {
          id: classification_id,
          alias: classification_alias(classification_id),
          gray_image_class: gray_image_class(classification_id)
        },
        activity_category: {id: a['activity_category_id'].to_i, name: a['activity_category_name']},
        topic: {
          name: a['topic_name'],
          section: {id: a['section_id'].to_i, name: a['section_name']}
        }
      }
    end
  end

  def get_activity_categories_classifications_topics_and_section
    section_ids = []
    activity_classification_ids = []
    @activities.each do |a|
      section_ids << a['section_id']
      activity_classification_ids << a['classification_id'].to_i
    end
    @activity_classification_ids = activity_classification_ids.uniq
    start = Time.now
    @activity_classifications = get_activity_classifications
    finish = Time.now - start
    puts 'yooooo'
    puts finish
    @activity_categories = ActivityCategory.all
    @sections = Section.where(id: section_ids.uniq)
  end

  def get_activity_classifications
    activity_classifications = ActiveRecord::Base.connection.execute("SELECT ac.key, ac.id FROM activity_classifications AS ac WHERE ac.id = ANY(array#{@activity_classification_ids})").to_a
    activity_classifications.map do |ac|
      ac['alias'] = classification_alias(ac['id'].to_i)
      ac
    end
  end

  def classification_alias(classification_id)
    case classification_id
    when 1
      'Quill Proofreader'
    when 2
      'Quill Grammar'
    when 4
      'Quill Diagnostic'
    when 5
      'Quill Connect'
    when 6
      'Quill Lessons'
    end
  end

  def gray_image_class(classification_id)
    case classification_id
    when 1
      'icon-flag-gray'
    when 2
      'icon-puzzle-gray'
    when 4
      'icon-diagnostic-gray'
    when 5
      'icon-connect-gray'
    when 6
      'icon-lessons-gray'
    end
  end

end
