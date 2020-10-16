class ActivitySearch
  # filters = hash of model_name/model_id pairs
  # sort = hash with 'field' and 'asc_or_desc' (?) as keys
  def self.search(flag)
    case flag
    when 'private'
      flags = "'private', 'alpha', 'beta', 'production'"
    when 'alpha'
      flags = "'alpha', 'beta', 'production'"
    when 'beta'
      flags = "'beta', 'production'"
    else
      flags = "'production'"
    end

    ActiveRecord::Base.connection.execute("SELECT DISTINCT
        activities.name AS activity_name,
    		activities.description AS activity_description,
    		activities.flags AS activity_flag,
    		activities.id AS activity_id,
    		activities.uid AS activity_uid,
        activity_categories.id AS activity_category_id,
        activity_categories.name AS activity_category_name,
        standard_levels.id AS standard_level_id,
        standard_levels.name AS standard_level_name,
        standards.name AS standard_name,
        activity_classifications.id AS classification_id,
        activity_classifications.order_number,
        activity_categories.order_number,
        activity_category_activities.order_number
      FROM activities
      LEFT JOIN activity_classifications ON activities.activity_classification_id = activity_classifications.id
      LEFT JOIN standards ON activities.standard_id = standards.id
      LEFT JOIN standard_levels ON standards.standard_level_id = standard_levels.id
      LEFT JOIN activity_category_activities ON activities.id = activity_category_activities.activity_id
      LEFT JOIN activity_categories ON activity_category_activities.activity_category_id = activity_categories.id
      AND activities.flags && ARRAY[#{flags}]::varchar[]
      ORDER BY activity_classifications.order_number asc, activity_categories.order_number asc, activity_category_activities.order_number asc").to_a
  end
end
