class LessonRecommendationsQuery
  attr_reader :relation, :activity_id, :classroom_id

  def initialize(activity_id, classroom_id = nil, relation = Activity)
    @relation = relation
    @activity_id = activity_id
    @classroom_id = classroom_id
  end

  def activity_recommendations
    if classroom_id
      mark_previously_assigned(recommendations, classroom_id)
    else
      recommendations
    end
  end

  private def activity
    @activity ||= relation.find(activity_id)
  end

  private def recommendations
    @recommendations ||= JSON.parse(
      serialized_recommendations,
      symbolize_names: true
    )
  end

  private def get_activities(rec_id)
    activities = ActiveRecord::Base.connection.execute("SELECT activities.name, activities.id
      FROM activities
      INNER JOIN activities_unit_templates ON activities.id = activities_unit_templates.activity_id
      INNER JOIN activity_category_activities ON activities.id = activity_category_activities.activity_id
      INNER JOIN activity_categories ON activity_categories.id = activity_category_activities.activity_category_id
      WHERE activities_unit_templates.unit_template_id = #{rec_id}
      ORDER BY activity_categories.order_number, activity_category_activities.order_number").to_a
    activities.map do |act|
      url = "/activity_sessions/anonymous?activity_id=#{act['id']}"
      {name: act['name'], url: url}
    end
  end

  private def previous_unit_names(classroom_id)
    ActiveRecord::Base.connection.execute("SELECT DISTINCT unit.name FROM units unit
    LEFT JOIN classroom_units as cu ON cu.unit_id = unit.id
    WHERE cu.classroom_id = #{classroom_id}
    AND cu.visible = true
    AND unit.visible = true").to_a.map {|e| e['name']}
  end

  private def mark_previously_assigned(recs, classroom_id)
    prev_names = previous_unit_names(classroom_id)
    recs.each { |r| r[:previously_assigned] = prev_names.include?(r[:recommendation]) }
    recs
  end

  private def serialized_recommendations
    @serialized_recommendations ||= Jbuilder.new do |json|
      json.array! activity.recommendations.group_lesson do |recommendation|
        json.recommendation recommendation.name
        json.activityPackId recommendation.unit_template.id
        json.activities get_activities(recommendation.unit_template.id)

        if recommendation.criteria.present?
          json.requirements recommendation.criteria do |criterion|
            json.concept_id criterion.concept.uid
            json.count criterion.count
            json.noIncorrect criterion.no_incorrect
          end
        end
      end
    end.target!
  end
end
