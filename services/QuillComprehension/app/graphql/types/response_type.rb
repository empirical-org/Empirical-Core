Types::ResponseType = GraphQL::ObjectType.define do
  name 'Response'

  field :id, !types.ID
  field :question_id,  !types.Int
  field :submissions, !types.Int
  field :text, !types.String
end