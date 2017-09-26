class ActivitySearch
  # filters = hash of model_name/model_id pairs
  # sort = hash with 'field' and 'asc_or_desc' (?) as keys
  def self.search(search_text, filters, sort, flag)
    # TODO sanitize search_text
    query = ActiveRecord::Base.connection.execute("SELECT *,
        sections.id AS section_id,
        activity_categories.id AS activity_category_id,
        activity_categories.name AS activity_category_name,
        sections.name AS section_name,
        activity_classifications.id AS classification_id
      FROM activities
      LEFT JOIN activity_classifications ON activities.activity_classification_id = activity_classifications.id
      LEFT JOIN topics ON activities.topic_id = topics.id
      LEFT JOIN sections ON topics.section_id = sections.id
      LEFT JOIN activity_category_activities ON activities.id = activity_category_activities.activity_id
      LEFT JOIN activity_categories ON activity_category_activities.activity_category_id = activity_categories.id
      WHERE (activities.name ILIKE '%#{search_text}%' OR activity_categories.name ILIKE '%#{search_text}%' OR activities.description ILIKE '%#{search_text}%')
      AND activity_categories.id IS NOT NULL
      AND sections.id IS NOT NULL
      ORDER BY #{search_sort_sql(sort)}").to_a

    # query = Activity.user_scope(flag)
    #         .joins("LEFT JOIN activity_classifications ON activities.activity_classification_id = activity_classifications.id")
    #         .joins("LEFT JOIN topics ON activities.topic_id = topics.id")
    #         .joins("LEFT JOIN sections ON topics.section_id = sections.id")
    #         .joins("LEFT JOIN activity_category_activities ON activities.id = activity_category_activities.activity_id")
    #         .joins("LEFT JOIN activity_categories ON activity_category_activities.activity_category_id = activity_categories.id")
    #         .where("(activities.name ILIKE ?) OR (activity_categories.name ILIKE ?) OR (activities.description ILIKE ?)", "%#{search_text}%", "%#{search_text}%", "%#{search_text}%")
    #         .where("activity_categories.id IS NOT NULL AND sections.id IS NOT NULL")
    #         .order(search_sort_sql(sort))

    # Sorry for the meta-programming.
    filters.each do |model_name, model_id| # :activity_classifications, 123
      query = query.where("#{model_name}.id = ?", model_id)
    end

    query
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
