# frozen_string_literal: true

class Types::ActivityScoreType < Types::BaseObject
  graphql_name 'ActivityScore'

  field :activity_id, Int, null: false
  field :percentage, Float, null: false
  field :updated_at, Int, null: false
  field :in_progress, Boolean, null: false

  def in_progress
    object.resume_link == 1
  end
end