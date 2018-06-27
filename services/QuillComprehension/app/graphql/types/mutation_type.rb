Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createNewResponse, function: Mutations::CreateNewResponse.new

  field :createResponseLabelTag, function: Mutations::CreateResponseLabelTag.new
end
