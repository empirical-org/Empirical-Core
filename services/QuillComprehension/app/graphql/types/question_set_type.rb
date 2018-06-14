Types::QuestionSetType = GraphQL::ObjectType.define do
  name 'QuestionSet'

  field :id, !types.ID
  field :activity_id,  !types.Int
  field :order, !types.Int
  field :prompt, !types.String
  
  field :questions, !types[Types::QuestionType] do
    resolve -> (obj, args, ctx) {
      obj.questions
    }
  end
end