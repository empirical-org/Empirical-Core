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

  def manditory_concept
    @manditory_concept ||= Concept.find_or_create_by(name: 'Manditory')
  end

  def serialized_recommendations
    @serialized_recommendations ||= Jbuilder.new do |json|
      json.array! activity.recommendations.independent_practice do |recommendation|
        json.recommendation recommendation.name
        json.activityPackId recommendation.unit_template.id

        if recommendation.criteria.present?
          json.requirements recommendation.criteria do |criterion|
            if criterion.concept.uid == manditory_concept.uid
              json.concept_id 'manditory'
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
