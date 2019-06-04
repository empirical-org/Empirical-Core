class Mutations::ChangeLogs::Create < Mutations::BaseMutation
  def self.authorized?(value, context)
    if !context[:current_user].staff?
      raise GraphQL::ExecutionError, "Only staff can run this mutation"
    else
      true
    end
  end

  null true

  argument :action, String, required: true
  argument :explanation, String, required: true
  argument :concept_id, String, required: true

  field :change_log, Types::ChangeLogType, null: true
  field :errors, [String], null: false

  def resolve(action, explanation, concept_id)
    change_log = ChangeLog.new(
      name: name,
      parent_id: parent_id,
      description: description,
      changed_record_type: 'concept',
      changed_record_id: concept_id,
      user_id: context[:current_user].id
    )
    if change_log.save
      # Successful creation, return the created object with no errors
      {
        change_log: change_log,
        errors: [],
      }
    else
      # Failed save, return the errors to the client
      {
        change_log: nil,
        errors: change_log.errors.full_messages
      }
    end
  end
end
