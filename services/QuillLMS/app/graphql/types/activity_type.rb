# frozen_string_literal: true

class Types::ActivityType < Types::BaseObject
  graphql_name 'Activity'

  field :id, ID, null: false
  field :uid, String, null: false
  field :name, String, null: false
  field :description, String, null: false
  field :activity_classification_id, ID, null: false
  field :flags, [String], null: false
  field :repeatable, Boolean, null: false

end