class Api::V1::ConceptsController < Api::ApiController
  doorkeeper_for :create

  def create
    concept = Concept.new(concept_params)
    if concept.save
      render json: {concept: {id: concept.id, name: concept.name, uid: concept.uid, parent_id: concept.parent.id}}
    else
      render json: concept.errors, status: 422
    end
  end

  def index
    render json: Concept.all_with_level
  end

  private

  def concept_params
    params.require(:concept).permit(:name, :parent_uid)
  end
end
