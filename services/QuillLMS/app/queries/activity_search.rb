# frozen_string_literal: true

class ActivitySearch
  # filters = hash of model_name/model_id pairs
  # sort = hash with 'field' and 'asc_or_desc' (?) as keys
  def self.search(flag)
    case flag
    when 'archived'
      flags = "'private', 'alpha', 'beta', 'gamma', 'production', 'archived'"
    when 'private'
      flags = "'private', 'alpha', 'beta', 'gamma', 'production'"
    when 'alpha'
      flags = "'alpha', 'beta', 'gamma', 'production'"
    when 'beta'
      flags = "'beta', 'gamma', 'production'"
    when 'gamma'
      flags = "'gamma', 'production'"
    else
      flags = "'production'"
    end

    RawSqlRunner.execute(
      <<-SQL
        SELECT DISTINCT
          activities.name AS activity_name,
          activities.description AS activity_description,
          activities.flags AS activity_flag,
          activities.id AS activity_id,
          activities.uid AS activity_uid,
          activities.maximum_grade_level AS activity_maximum_grade_level,
          activities.minimum_grade_level AS activity_minimum_grade_level,
          activity_categories.id AS activity_category_id,
          activity_categories.name AS activity_category_name,
          standard_levels.id AS standard_level_id,
          standard_levels.name AS standard_level_name,
          standards.name AS standard_name,
          activity_classifications.id AS classification_id,
          activity_classifications.key AS classification_key,
          activity_classifications.order_number,
          activity_categories.order_number,
          activity_category_activities.order_number,
          content_partners.name AS content_partner_name,
          content_partners.description AS content_partner_description,
          content_partners.id AS content_partner_id,
          topics.id AS topic_id,
          topics.name AS topic_name,
          topics.parent_id AS topic_parent_id,
          topics.level AS topic_level
        FROM activities
        LEFT JOIN activity_classifications
          ON activities.activity_classification_id = activity_classifications.id
        LEFT JOIN standards
          ON activities.standard_id = standards.id
        LEFT JOIN standard_levels
          ON standards.standard_level_id = standard_levels.id
        LEFT JOIN activity_category_activities
          ON activities.id = activity_category_activities.activity_id
        LEFT JOIN activity_categories
          ON activity_category_activities.activity_category_id = activity_categories.id
        LEFT JOIN content_partner_activities
          ON content_partner_activities.activity_id = activities.id
        LEFT JOIN content_partners
          ON content_partners.id = content_partner_activities.content_partner_id
        LEFT JOIN activity_topics
          ON activity_topics.activity_id = activities.id
        LEFT JOIN topics
          ON activity_topics.topic_id = topics.id
          AND topics.visible
        WHERE activities.flags && ARRAY[#{flags}]::varchar[]
        ORDER BY
          activity_classifications.order_number ASC,
          activity_categories.order_number ASC,
          activity_category_activities.order_number ASC
      SQL
    ).to_a
  end
end
