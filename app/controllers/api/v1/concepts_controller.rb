class Api::V1::ConceptsController < Api::ApiController
  doorkeeper_for :create

  def create
    concept = Concept.new(concept_params)
    if concept.save
      render json: {concept: Api::SimpleSerializer.new(concept).as_json(root: false)}
    else
      render json: concept.errors, status: 422
    end
  end

  def index
    render json: Concept.all_with_depth
  end

  private

  def concept_params
    parent = Concept.find_by uid: params[:parent_uid]
    params[:parent_id] = parent.id
    params.permit(:name, :parent_id)
  end

end