class ActivitySearchWrapper
  RESULTS_PER_PAGE = 12

  def initialize(flag=nil, user_id=nil)
    @activities = nil
    @activity_classifications = []
    @standards = []
    @activity_categories = []
    @standard_levels = []
    @flag = flag
    @user_id = user_id
  end

  def search
    if @user_id
      ActivitySearchAnalyticsWorker.perform_async(@user_id, @search_query)
    end
    custom_search_results
    search_result
  end

  def search_result
    {
      activities: @activities,
      activity_classifications: @activity_classifications,
      activity_categories: @activity_categories,
      standard_levels: @standard_levels,
    }
  end

  def self.search_cache_data(flag = nil)
    substring = flag ? flag + "_" : ""
    activity_search_json = ActivitySearchWrapper.new(flag).search.to_json
    $redis.set("default_#{substring}activity_search", activity_search_json)
    activity_search_json
  end

  private

  def custom_search_results
    activity_search
    activity_categories_classifications_standards_and_standard_level
    formatted_search_results
  end

  def activity_search
    @activities = ActivitySearch.search(@flag)
  end

  def formatted_search_results
    unique_activities_array = []
    @activities.each do |a|
      activity_id = a['activity_id'].to_i
      content_partners = a['content_partner_name'] ? [{ name: a['content_partner_name'], description: a['content_partner_description']}] : []
      existing_record = unique_activities_array.find { |act| act[:id] == activity_id }
      # if there is an existing record, it is possible that that's because the activity has more than one content partner
      if existing_record
        content_partners = existing_record[:content_partners].concat(content_partners).uniq
        index_of_existing_record = unique_activities_array.find_index(existing_record)
        unique_activities_array[index_of_existing_record][:content_partners] = content_partners
      else
        classification_id = a['classification_id'].to_i
        act = {
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
          standard_level: {id: a['standard_level_id'].to_i, name: a['standard_level_name']},
          standard_level_name: a['standard_level_name'],
          standard_name: a['standard_name'],
          content_partners: content_partners
        }
        unique_activities_array.push(act)
      end
    end
    @activities = unique_activities_array
  end

  def activity_categories_classifications_standards_and_standard_level
    standard_level_ids = []
    activity_classification_ids = []
    @activities.each do |a|
      standard_level_ids << a['standard_level_id']
      activity_classification_ids << a['classification_id'].to_i
    end
    @activity_classification_ids = activity_classification_ids.uniq
    @activity_classifications = activity_classifications
    @activity_categories = ActivityCategory.all
    @standard_levels = StandardLevel.where(id: standard_level_ids.uniq)
  end

  def activity_classifications
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
        key: 'passage'
      }
    when 2
      h = {
        alias: 'Quill Grammar',
        description: 'Practice Mechanics',
        key: 'sentence'
      }
    when 4
      h = {
        alias: 'Quill Diagnostic',
        description: 'Identify Learning Gaps',
        key: 'diagnostic'
      }
    when 5
      h = {
        alias: 'Quill Connect',
        description: 'Combine Sentences',
        key: 'connect'
      }
    when 6
      h = {
        alias: 'Quill Lessons',
        description: 'Lead Group Lessons',
        key: 'lessons'
      }
    else
      h = {}
    end
    h[:id] = classification_id
    h
  end

end
