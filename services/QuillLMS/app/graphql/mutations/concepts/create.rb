class Mutations::Concepts::Create < Mutations::BaseMutation
  def self.authorized?(value, context)
    if !context[:current_user].staff?
      raise GraphQL::ExecutionError, "Only staff can run this mutation"
    else
      true
    end
  end

  null true

  argument :name, String, required: true
  argument :parent_id, ID, required: false

  field :concept, Types::ConceptType, null: true
  field :errors, [String], null: false

  def resolve(name:, parent_id: nil)
    concept = Concept.new(name: name, parent_id: parent_id)
    if concept.save
      # Successful creation, return the created object with no errors
      {
        concept: concept,
        errors: [],
      }
    else
      # Failed save, return the errors to the client
      {
        concept: nil,
        errors: concept.errors.full_messages
      }
    end
  end
end