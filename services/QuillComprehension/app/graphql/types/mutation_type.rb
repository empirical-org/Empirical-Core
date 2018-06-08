Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createNewResponse, function: Mutations::CreateNewResponse.new
end
