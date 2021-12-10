# frozen_string_literal: true

class Profile::StudentActivitySerializer < ActiveModel::Serializer
  attributes :name, :description, :repeatable, :activity_classification_id
end
