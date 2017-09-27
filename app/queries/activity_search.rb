class ActivitySearch
  # filters = hash of model_name/model_id pairs
  # sort = hash with 'field' and 'asc_or_desc' (?) as keys
  def self.search(search_text, filters, sort, flag)
    filter_string = ''
    filters.each do |model_name, model_id|
      filter_string.concat("AND #{model_name}.id = #{model_id}")
    end

    sanitized_search_text = search_text.length > 0 ? ActiveRecord::Base.sanitize(search_text) : ''

    ActiveRecord::Base.connection.execute("SELECT
        activities.name AS activity_name,
    		activities.description AS activity_description,
    		activities.flags AS activity_flag,
    		activities.id AS activity_id,
    		activities.uid AS activity_uid,
        activity_categories.id AS activity_category_id,
        activity_categories.name AS activity_category_name,
        sections.id AS section_id,
        sections.name AS section_name,
        topics.name AS topic_name,
        activity_classifications.id AS classification_id
      FROM activities
      LEFT JOIN activity_classifications ON activities.activity_classification_id = activity_classifications.id
      LEFT JOIN topics ON activities.topic_id = topics.id
      LEFT JOIN sections ON topics.section_id = sections.id
      LEFT JOIN activity_category_activities ON activities.id = activity_category_activities.activity_id
      LEFT JOIN activity_categories ON activity_category_activities.activity_category_id = activity_categories.id
      WHERE (activities.name ILIKE '%#{sanitized_search_text}%' OR activity_categories.name ILIKE '%#{sanitized_search_text}%' OR activities.description ILIKE '%#{sanitized_search_text}%')
      AND activity_categories.id IS NOT NULL
      AND sections.id IS NOT NULL
      #{filter_string}
      ORDER BY #{search_sort_sql(sort)}").to_a
  end

  private

  def self.search_sort_sql(sort)
    return 'activity_classifications.order_number asc, activity_categories.order_number asc, activity_category_activities.order_number asc' if sort.blank?

    if sort['asc_or_desc'] == 'desc'
      order = 'desc'
    else
      order = 'asc'
    end

    case sort['field']
    when 'activity'
      field = 'activities.name'
    when 'activity_classification'
      field = 'activity_classifications.order_number'
      field2 = 'activity_categories.order_number'
      field3 = 'activity_category_activities.order_number'
    when 'section'
      field = 'sections.position'
    when 'activity_category'
      field = 'activity_categories.order_number'
      field2 = 'activity_category_activities.order_number'
    end

    return (field + ' ' + order + ', ' + field2 + ' ' + order + ', ' + field3 + ' ' + order) if field3
    return (field + ' ' + order + ', ' + field2 + ' ' + order) if field2
    field + ' ' + order
  end
end
