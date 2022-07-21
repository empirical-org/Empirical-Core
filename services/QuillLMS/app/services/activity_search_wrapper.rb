# frozen_string_literal: true

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
    substring = flag ? "#{flag}_" : ""
    activity_search_json = ActivitySearchWrapper.new(flag).search.to_json
    $redis.set("default_#{substring}activity_search", activity_search_json)
    activity_search_json
  end

  private def custom_search_results
    activity_search
    activity_categories_classifications_standards_and_standard_level
    formatted_search_results
  end

  private def activity_search
    @activities = ActivitySearch.search(@flag)
  end

  private def formatted_search_results
    unique_activities_array = []
    @activities.each do |a|
      activity_id = a['activity_id'].to_i
      content_partners = a['content_partner_name'] ? [{ name: a['content_partner_name'], description: a['content_partner_description'], id: a['content_partner_id'].to_i}] : []
      topics = a['topic_name'] ? [{ name: a['topic_name'], level: a['topic_level'], id: a['topic_id'].to_i, parent_id: a['topic_parent_id'].to_i }] : []
      existing_record = unique_activities_array.find { |act| act[:id] == activity_id }
      # if there is an existing record, it is possible that that's because the activity has more than one content partner
      if existing_record
        content_partners = existing_record[:content_partners].concat(content_partners).uniq
        topics = existing_record[:topics].concat(topics).uniq
        index_of_existing_record = unique_activities_array.find_index(existing_record)
        unique_activities_array[index_of_existing_record][:content_partners] = content_partners
        unique_activities_array[index_of_existing_record][:topics] = topics
      else
        classification_id = a['classification_id'].to_i

        act = {
          name: a['activity_name'],
          description: a['activity_description'],
          flags: a['activity_flag'],
          id: activity_id,
          uid: a['activity_uid'],
          anonymous_path: Rails.application.routes.url_helpers.anonymous_activity_sessions_path(activity_id: activity_id),
          activity_classification: classification_hash(a['classification_key'], classification_id),
          activity_category: {id: a['activity_category_id'].to_i, name: a['activity_category_name']},
          activity_category_name: a['activity_category_name'],
          activity_category_id: a['activity_category_id'].to_i,
          standard_level: {id: a['standard_level_id'].to_i, name: a['standard_level_name']},
          standard_level_name: a['standard_level_name'],
          standard_name: a['standard_name'],
          content_partners: content_partners,
          topics: topics,
          readability_grade_level: Activity.find(activity_id).readability_grade_level,
          minimum_grade_level: a['activity_minimum_grade_level'],
          maximum_grade_level: a['activity_maximum_grade_level']
        }
        unique_activities_array.push(act)
      end
    end
    @activities = unique_activities_array
  end

  private def activity_categories_classifications_standards_and_standard_level
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

  private def activity_classifications
    if @activity_classification_ids.any?
      activity_classifications = RawSqlRunner.execute(
        <<-SQL
          SELECT
            ac.key,
            ac.id,
            ac.order_number
          FROM activity_classifications AS ac
          WHERE ac.id = ANY(array#{@activity_classification_ids})
        SQL
      ).to_a

      activity_classification_details = activity_classifications.map do |ac|
        {
          alias: classification_hash(ac['key'], ac['id'])[:alias],
          id: ac['id'],
          key: ac['key'],
          order: ac['order_number']
        }
      end
      activity_classification_details.sort_by { |key| key[:order] }
    else
      []
    end
  end

  private def classification_hash(classification_key, classification_id)
    case classification_key
    when ActivityClassification::PROOFREADER_KEY
      h = {
        alias: 'Quill Proofreader',
        description: 'Fix Errors in Passages',
        gradeText: '2nd - 12th Grade',
        key: ActivityClassification::PROOFREADER_KEY
      }
    when ActivityClassification::GRAMMAR_KEY
      h = {
        alias: 'Quill Grammar',
        description: 'Practice Mechanics',
        gradeText: '2nd - 12th Grade',
        key: ActivityClassification::GRAMMAR_KEY
      }
    when ActivityClassification::DIAGNOSTIC_KEY
      h = {
        alias: 'Quill Diagnostic',
        description: 'Identify Learning Gaps',
        gradeText: '2nd - 12th Grade',
        key: ActivityClassification::DIAGNOSTIC_KEY
      }
    when ActivityClassification::CONNECT_KEY
      h = {
        alias: 'Quill Connect',
        description: 'Combine Sentences',
        gradeText: '2nd - 12th Grade',
        key: ActivityClassification::CONNECT_KEY
      }
    when ActivityClassification::LESSONS_KEY
      h = {
        alias: 'Quill Lessons',
        description: 'Lead Group Lessons',
        gradeText: '4th - 12th Grade',
        key: ActivityClassification::LESSONS_KEY
      }
    when ActivityClassification::EVIDENCE_KEY
      h = {
        alias: 'Quill Reading for Evidence',
        description: 'Use a Text to Write with Evidence',
        key: ActivityClassification::EVIDENCE_KEY,
        gradeText: '8th - 12th Grade',
        new: true
      }
    else
      h = {}
    end
    h[:id] = classification_id
    h
  end

end
