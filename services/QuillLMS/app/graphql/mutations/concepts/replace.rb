# frozen_string_literal: true

class Mutations::Concepts::Replace < Mutations::BaseMutation
  def self.authorized?(value, context)
    return true if context[:current_user].staff?

    raise GraphQL::ExecutionError, "Only staff can run this mutation"
  end

  null false

  argument :id, ID, required: true
  argument :replacement_id, ID, required: true
  argument :change_logs, [Types::ChangeLogInput], required: true

  field :concept, Types::ConceptType, null: false
  field :errors, [String], null: false

  def resolve(inputs)
    concept = Concept.find(inputs[:id])
    previous_replacement_id = concept.replacement_id
    replacement = Concept.find(inputs[:replacement_id])
    if replacement && concept.update(replacement_id: inputs[:replacement_id], visible: false)

      ConceptReplacementWorker.perform_async(concept.id, replacement.id)
      change_logs = inputs[:change_logs].map do |cl|
        {
          explanation: cl[:explanation],
          action: cl[:action],
          changed_record_id: cl[:recordID],
          changed_record_type: 'Concept',
          user_id: context[:current_user].id,
          changed_attribute: 'replacement_id',
          new_value: replacement.id,
          previous_value: previous_replacement_id
        }
      end
      ChangeLog.create(change_logs)

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
