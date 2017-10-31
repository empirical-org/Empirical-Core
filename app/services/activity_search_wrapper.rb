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
        activity_classification: classification_hash(classification_id),
        activity_category: {id: a['activity_category_id'].to_i, name: a['activity_category_name']},
        activity_category_name: a['activity_category_name'],
        activity_category_id: a['activity_category_id'].to_i,
        section: {id: a['section_id'].to_i, name: a['section_name']},
        section_name: a['section_name']
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
    @activity_classifications = get_activity_classifications
    @activity_categories = ActivityCategory.all
    @sections = Section.where(id: section_ids.uniq)
  end

  def get_activity_classifications
    if @activity_classification_ids.any?
      activity_classifications = ActiveRecord::Base.connection.execute("SELECT ac.key, ac.id, ac.order_number FROM activity_classifications AS ac WHERE ac.id = ANY(array#{@activity_classification_ids})").to_a
      activity_classification_details = activity_classifications.map do |ac|
        ac_id = ac['id'].to_i
        {
          alias: classification_hash(ac_id)[:alias],
          id: ac_id,
          key: ac['key'],
          order: ac['order_number'].to_i
        }
      end
      activity_classification_details.sort_by { |key| key[:order] }
    else
      []
    end
  end

  def classification_hash(classification_id)
    case classification_id
    when 1
      h = {
        alias: 'Quill Proofreader',
        description: 'Fix Errors in Passages',
        gray_image_class: 'icon-flag-gray',
        key: 'passage'
      }
    when 2
      h = {
        alias: 'Quill Grammar',
        description: 'Practice Mechanics',
        gray_image_class: 'icon-puzzle-gray',
        key: 'sentence'
      }
    when 4
      h = {
        alias: 'Quill Diagnostic',
        description: 'Identify Learning Gaps',
        gray_image_class: 'icon-diagnostic-gray',
        key: 'diagnostic'
      }
    when 5
      h = {
        alias: 'Quill Connect',
        description: 'Combine Sentences',
        gray_image_class: 'icon-connect-gray',
        key: 'connect'
      }
    when 6
      h = {
        alias: 'Quill Lessons',
        description: 'Shared Group Lessons',
        gray_image_class: 'icon-lessons-gray',
        key: 'lessons'
      }
    end
    h[:id] = classification_id
    h
  end

end
