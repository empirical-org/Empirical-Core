class UnitTemplatePseudoSerializer
  # attributes :id, :name, :time, :grades, :order_number, :number_of_standards, :activity_info, :author, :unit_template_category, :activities, :topics

  def initialize(unit_template, flag=nil)
    @unit_template = unit_template
  end

  def data
    ut = @unit_template
    {
      id: ut.id,
      name: ut.name,
      time: ut.time,
      grades: ut.grades,
      order_number: ut.order_number,
      created_at: ut.created_at.to_i,
      number_of_standards: number_of_standards,
      activity_info: ut.activity_info,
      author: author,
      unit_template_category: unit_template_category,
      activities: activities,
      type: type
    }
  end

  def number_of_standards
    section_ids = []
    @unit_template.activities.each do |act|
      section_ids << act.topic.section_id
    end
    section_ids.uniq.count
  end

  def unit_template_category
    cat = @unit_template.unit_template_category
    {
      primary_color: cat&.primary_color,
      secondary_color: cat&.secondary_color,
      name: cat&.name,
      id: cat&.id
    }
  end

  def author
    author = @unit_template.author
    {
      name: author&.name,
      avatar_url: author.avatar_url
    }
  end

  def activities
    activities = ActiveRecord::Base.connection.execute("SELECT activities.id,
        activities.name,
        activities.flags,
        activities.description,
        activity_classifications.key,
        activity_classifications.id AS activity_classification_id,
        activity_classifications.name AS activity_classification_name,
        topics.id AS topic_id,
        topics.name AS topic_name,
        sections.name AS section_name,
        topic_categories.id AS topic_category_id,
        topic_categories.name AS topic_category_name
      FROM activities
      INNER JOIN topics ON topics.id = activities.topic_id
      INNER JOIN sections ON topics.section_id = sections.id
      INNER JOIN topic_categories ON topics.topic_category_id = topic_categories.id
      INNER JOIN activities_unit_templates ON activities.id = activities_unit_templates.activity_id
      INNER JOIN activity_classifications ON activities.activity_classification_id = activity_classifications.id
      INNER JOIN activity_category_activities ON activities.id = activity_category_activities.activity_id
      INNER JOIN activity_categories ON activity_categories.id = activity_category_activities.activity_category_id
      WHERE activities_unit_templates.unit_template_id = #{@unit_template.id}
      AND NOT 'archived' = ANY(activities.flags)
      ORDER BY activities_unit_templates.order_number, activity_categories.order_number, activity_category_activities.order_number").to_a
    activity_hashes = activities.map do |act|
      {
        id: act['id'],
        name: act['name'],
        description: act['description'],
        section_name: act['section_name'],
        topic: {
          id: act['topic_id'],
          name: act['topic_name'],
          topic_category: {
            id: act['topic_category_id'],
            name: act['topic_category_name']
          }
        },
        classification: {key: act['key'], id: act['activity_classification_id'], name: act['activity_classification_name']}
      }
    end
    activity_hashes.uniq { |a| a[:id] }
  end

  def type
    activities = @unit_template.activities
    if activities.any? { |act| act&.classification&.key == ActivityClassification::LESSONS_KEY }
      {
        name: UnitTemplate::WHOLE_CLASS_AND_INDEPENDENT_PRACTICE,
        primary_color: '#9c2bde'
      }
    elsif activities.any? { |act| act&.classification&.key == ActivityClassification::DIAGNOSTIC_KEY }
      {
        name: UnitTemplate::DIAGNOSTIC,
        primary_color: '#ea9a1a'
      }
    else
      {
        name: UnitTemplate::INDEPENDENT_PRACTICE,
        primary_color: '#348fdf'
      }
    end
  end

end
