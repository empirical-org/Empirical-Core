Types::ActivityType = GraphQL::ObjectType.define do
  name 'Activity'

  field :id, !types.ID
  field :title, !types.String
  field :article, !types.String
  field :description, !types.String

  field :questions, !types[Types::QuestionType] do
    resolve -> (obj, args, ctx) {
      obj.questions
    }
  end
end