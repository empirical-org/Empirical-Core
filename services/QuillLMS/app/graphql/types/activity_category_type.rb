# frozen_string_literal: true

class Types::ActivityCategoryType < Types::BaseObject
  graphql_name 'ActivityCategory'

  field :id, ID, null: false
  field :name, String, null: false
  field :order_number, Int, null: false

  field :activities, [Types::ActivityType], null: false

  def activities
    object.activities
  end
end