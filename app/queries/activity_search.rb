class ActivitySearch
  # filters = hash of model_name/model_id pairs
  # sort = hash with 'field' and 'asc_or_desc' (?) as keys
  def self.search(search_text, filters, sort, flag)
    query = Activity.user_scope(flag).includes(:classification, topic: [:section, :topic_category])
      .where("(activities.name ILIKE ?) OR (topic_categories.name ILIKE ?)", "%#{search_text}%", "%#{search_text}%")
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
    return 'sections.name asc' if sort.blank?

    if sort['asc_or_desc'] == 'desc'
      order = 'desc'
    else
      order = 'asc'
    end

    case sort['field']
    when 'activity'
      field = 'activities.name'
    when 'activity_classification'
      field = 'activity_classifications.name'
    when 'section'
      field = 'sections.name'
    when 'topic_category'
      field = 'topic_categories.name'
    end

    field + ' ' + order
  end
end
