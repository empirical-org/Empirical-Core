# frozen_string_literal: true

class Profile::ClassroomSerializer < ActiveModel::Serializer
  attributes :name
  has_one :teacher
end