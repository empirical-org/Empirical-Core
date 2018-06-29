class Mutations::CreateResponseLabelTag < GraphQL::Function

  argument :response_label_id, types.ID
  argument :response_id, types.ID
  argument :score, types.Int 
  
  type Types::ResponseLabelTagType

  def call(obj, args, ctx)
    response_label_id = args[:response_label_id]
    response_id = args[:response_id]
    score = args[:score]
    return unless response_label_id && response_id && score

    ResponseLabelTag.create(response_label_id: response_label_id, response_id: response_id, score: score)
  end

end