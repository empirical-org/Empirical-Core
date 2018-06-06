Types::ActivityType = GraphQL::ObjectType.define do
  name 'Activity'

  field :id, !types.ID
  field :title, !types.String
  field :article, !types.String
  field :description, !types.String
end