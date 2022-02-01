# frozen_string_literal: true

class Types::NotificationType < Types::BaseObject
  graphql_name 'Notification'

  field :id, ID, null: false
  field :text, String, null: false
  field :user_id, ID, null: false
  field :href, String, null: true

  def href
    object.meta['href']
  end

end