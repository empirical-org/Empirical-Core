class Types::ChangeLogType < Types::BaseObject
  graphql_name 'ChangeLog'

  field :id, ID, null: false
  field :action, String, null: false
  field :explanation, String, null: false
  field :changed_record_id, ID, null: false
  field :changed_record_type, ID, null: false
  field :user_id, ID, null: false
  field :created_at, Int, null: false
  field :updated_at, Int, null: false

  field :concept, Types::ConceptType, null: false
  field :user, Types::UserType, null: false

  def concept
    Concept.find(object['changed_record_id'])
  end

  def user
    User.find(object['user_id'])
  end

end
