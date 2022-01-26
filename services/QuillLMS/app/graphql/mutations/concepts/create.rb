# frozen_string_literal: true

class Mutations::Concepts::Create < Mutations::BaseMutation
  def self.authorized?(value, context)
    return true if context[:current_user].staff?

    raise GraphQL::ExecutionError, "Only staff can run this mutation"
  end

  null true

  argument :name, String, required: true
  argument :parent_id, ID, required: false
  argument :description, String, required: false
  argument :explanation, String, required: false
  argument :change_logs, [Types::ChangeLogInput], required: true

  field :concept, Types::ConceptType, null: true
  field :errors, [String], null: false

  def resolve(name:, change_logs:, parent_id: nil, description: nil, explanation: nil)
    concept = Concept.new(name: name, parent_id: parent_id, description: description, explanation: explanation)
    if concept.save
      # Successful creation, return the created object with no errors
      change_logs = change_logs.map do |cl|
        {
          explanation: cl[:explanation],
          action: cl[:action],
          changed_record_id: concept.id,
          changed_record_type: 'Concept',
          user_id: context[:current_user].id
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
        concept: nil,
        errors: concept.errors.full_messages
      }
    end
  end
end
