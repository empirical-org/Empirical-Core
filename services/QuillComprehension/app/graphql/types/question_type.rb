Types::QuestionType = GraphQL::ObjectType.define do
  name 'Question'

  field :id, !types.ID
  field :activity_id,  !types.Int
  field :order, !types.Int
  field :prompt, !types.String
  field :responses, !types[Types::ResponseType] do
    resolve -> (obj, args, ctx) {
      obj.responses
    }
  end
end