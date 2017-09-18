class ActivitySearch
  # filters = hash of model_name/model_id pairs
  # sort = hash with 'field' and 'asc_or_desc' (?) as keys
  def self.search(search_text, filters, sort, flag)
    query = Activity.user_scope(flag).includes(:classification, topic: [:section, :topic_category], activity_category_activities: [:activity_category])
      .where("(activities.name ILIKE ?) OR (activity_categories.name ILIKE ?) OR (activities.description ILIKE ?)", "%#{search_text}%", "%#{search_text}%", "%#{search_text}%")
      .where("topic_categories.id IS NOT NULL AND sections.id IS NOT NULL")
      .order(search_sort_sql(sort)).references(:topic)

    # Sorry for the meta-programming.
    filters.each do |model_name, model_id| # :activity_classifications, 123
      query = query.where("#{model_name}.id = ?", model_id)
    end

    query
  end

  private

  def self.search_sort_sql(sort)
    return 'activity_categories.order_number asc, activity_classifications.order_number asc, activity_category_activities.order_number asc' if sort.blank?

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
      field2 = 'sections.position'
    when 'section'
      field = 'sections.position'
    when 'topic_category'
      field = 'topic_categories.name'
    end

    return (field + ' ' + order + ', ' + field2 + ' ' + order) if field2
    field + ' ' + order
  end
end
