class Api::V1::ConceptsController < Api::ApiController
  before_action :doorkeeper_authorize!, only: [:create]

  def create
    concept = Concept.new(concept_params)
    if concept.save
      render json: {concept: {id: concept.id, name: concept.name, uid: concept.uid, parent_id: concept.parent.id}}
    else
      render json: concept.errors, status: 422
    end
  end

  def index
    # Returns all the concepts, sorted by level
    # Example Response:
    # {
    #   concept_level_2: [concepts where the parent id is null],
    #   concept_level_1: [concepts where parent id matches a level two concept],
    #   concept_level_0: [concepts where parent id matches a level one concept]
    # }
    #
    render json: {concepts: Concept.all_with_level}.to_json
  end

  def level_zero_concepts_with_lineage
    concepts = Concept.level_zero_only.map { |c| { name: c.lineage, uid: c.uid } }.sort_by { |c| c[:name] }
    render json: { concepts: concepts }.to_json
  end

  private def concept_params
    params.require(:concept).permit(:name, :parent_uid)
  end
end
