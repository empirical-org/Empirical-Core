class Types::UserType < Types::BaseObject
  graphql_name 'User'

  field :id, ID, null: false
  field :name, String, null: false
  field :email, String, null: true
  field :username, String, null: true
  field :time_zone, String, null: true
end