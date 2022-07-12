# frozen_string_literal: true

class Profile::StudentActivitySerializer < ApplicationSerializer
  attributes :name, :description, :repeatable, :activity_classification_id
  type :student_activity
end
