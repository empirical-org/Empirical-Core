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

  private

  def activity
    @activity ||= relation.find(activity_id)
  end

  def serialized_recommendations
    @serialized_recommendations ||= Jbuilder.new do |json|
      json.array! activity.recommendations.independent_practice do |recommendation|
        json.recommendation recommendation.name
        json.activityPackId recommendation.unit_template.id

        if recommendation.criteria.present?
          json.requirements recommendation.criteria do |criterion|
            json.concept_id criterion.concept.uid
            json.count criterion.count
            if criterion.category == 'incorrect_submissions'
              json.noIncorrect true
            end
          end
        end
      end
    end.target!
  end
end
