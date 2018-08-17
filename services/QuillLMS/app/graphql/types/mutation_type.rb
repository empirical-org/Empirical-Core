class Types::MutationType < Types::BaseObject
  # TODO: remove me
  field :create_concept, mutation: Mutations::Concepts::Create
  field :edit_concept, mutation: Mutations::Concepts::Edit
end
