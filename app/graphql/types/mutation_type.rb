class Types::MutationType < Types::BaseObject
  # Concept Mutations
  field :create_concept, mutation: Mutations::Concepts::Create
  field :edit_concept, mutation: Mutations::Concepts::Edit
  field :replace_concept, mutation: Mutations::Concepts::Replace
end
