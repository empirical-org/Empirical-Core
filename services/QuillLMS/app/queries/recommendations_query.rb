class RecommendationsQuery
  attr_reader :relation, :activity_id

  def initialize(activity_id, relation = Activity)
    @relation = relation
    @activity_id = activity_id
  end

  def activity_recommendations
    @activity_recommendations ||= JSON.parse(
      serialized_recommendations,
      symbolize_names: true
    )
  end

  private def activity
    @activity ||= relation
      .includes(recommendations: [{ criteria: :concept }, :unit_template])
      .find(activity_id)
  end

  private def mandatory_concept
    @mandatory_concept ||= Concept.find_or_create_by(name: 'Mandatory')
  end

  private def serialized_recommendations
    @serialized_recommendations ||= Jbuilder.new do |json|
      json.array! activity.recommendations.independent_practice do |recommendation|
        json.recommendation recommendation.name
        json.activityPackId recommendation.unit_template.id

        if recommendation.criteria.present?
          json.requirements recommendation.criteria do |criterion|
            if criterion.concept.uid == mandatory_concept.uid
              json.concept_id 'mandatory'
            else
              json.concept_id criterion.concept.uid
            end
            json.count criterion.count
            json.noIncorrect criterion.no_incorrect
          end
        end
      end
    end.target!
  end
end
