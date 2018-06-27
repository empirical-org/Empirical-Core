Types::ResponseLabelType = GraphQL::ObjectType.define do
  name 'ResponseLabel'

  field :id, !types.ID
  field :name, !types.String
  field :description, !types.String

end