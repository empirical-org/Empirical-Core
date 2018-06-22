Types::ResponseLabelTagType = GraphQL::ObjectType.define do
  name 'ResponseLabelTag'
  description 'A tag for a response label'

  field :response_label_id, types.ID
  field :response_id, types.ID
  field :score, types.Int
end