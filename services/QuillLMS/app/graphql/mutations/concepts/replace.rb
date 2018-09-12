class Mutations::Concepts::Replace < Mutations::BaseMutation
  def self.authorized?(value, context)
    if !context[:current_user].staff?
      raise GraphQL::ExecutionError, "Only staff can run this mutation"
    else
      true
    end
  end

  null false

  argument :id, ID, required: true
  argument :replacement_id, ID, required: true

  field :concept, Types::ConceptType, null: false
  field :errors, [String], null: false

  def resolve(inputs)
    concept = Concept.find(inputs[:id])
    replacement = Concept.find(inputs[:replacement_id])
    values = inputs.reject{|k,v| k == :id}
    if replacement && concept.update(replacement_id: inputs[:replacement_id], visible: false)
      ConceptReplacementWorker.perform_async(concept.id, replacement.id)
      # Successful update, return the updated object with no errors
      {
        concept: replacement,
        errors: [],
      }
    else
      # Failed save, return the errors to the client
      {
        concept: concept,
        errors: concept.errors.full_messages
      }
    end
  end
end