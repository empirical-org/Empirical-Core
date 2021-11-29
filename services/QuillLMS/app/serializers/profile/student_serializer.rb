# frozen_string_literal: true

class Profile::StudentSerializer < ActiveModel::Serializer
  attributes :name
  has_one :classroom, serializer: Profile::ClassroomSerializer
end