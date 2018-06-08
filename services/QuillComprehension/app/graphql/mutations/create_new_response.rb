class Mutations::CreateNewResponse < GraphQL::Function

  argument :text, types.String
  argument :question_id, types.ID
  
  type Types::ResponseType

  def call(obj, args, ctx)
    text = args[:text]
    question_id = args[:question_id]
    return unless text && question_id

    response = Response.find_by(text: text, question_id: question_id)
    if response
      response.increment!(:submissions)
    else
      response = Response.create(text: text, question_id: question_id)
    end

    response
  end


  
end