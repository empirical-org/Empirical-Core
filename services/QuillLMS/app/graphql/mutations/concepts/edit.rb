# frozen_string_literal: true

class Mutations::Concepts::Edit < Mutations::BaseMutation
  def self.authorized?(value, context)
    return true if context[:current_user].staff?

    raise GraphQL::ExecutionError, "Only staff can run this mutation"
  end

  null false

  argument :id, ID, required: true
  argument :name, String, required: false
  argument :description, String, required: false
  argument :explanation, String, required: false
  argument :parent_id, ID, required: false
  argument :visible, Boolean, required: false
  argument :change_logs, [Types::ChangeLogInput], required: true

  field :concept, Types::ConceptType, null: true
  field :errors, [String], null: false

  def resolve(inputs)
    concept = Concept.find(inputs[:id])
    values = inputs.reject{|k,v| k == :id || k === :change_logs}
    if concept.update(values)
      # Successful update, return the updated object with no errors
      change_logs = inputs[:change_logs].map do |cl|
        {
          explanation: cl[:explanation],
          action: cl[:action],
          changed_record_id: cl[:recordID],
          changed_record_type: 'Concept',
          user_id: context[:current_user].id,
          previous_value: cl[:previousValue],
          new_value: cl[:newValue],
          changed_attribute: cl[:changedAttribute]
        }
      end
      ChangeLog.create(change_logs)

      {
        concept: concept,
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
