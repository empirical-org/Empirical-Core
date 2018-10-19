class Types::UserType < Types::BaseObject
  graphql_name 'User'

  field :id, ID, null: false
  field :name, String, null: false
  field :email, String, null: true
  field :username, String, null: true
  field :role, String, null: false
  field :time_zone, String, null: true

  field :notifications, [Types::NotificationType], null: true

  def notifications
    object.notifications.order("created_at DESC").limit(10)
  end

end