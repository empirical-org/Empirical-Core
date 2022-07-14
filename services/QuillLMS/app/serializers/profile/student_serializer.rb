# frozen_string_literal: true

class Profile::StudentSerializer < ApplicationSerializer
  attributes :name
  has_one :classroom, serializer: Profile::ClassroomSerializer
end
