# frozen_string_literal: true

class Profile::ClassroomSerializer < ApplicationSerializer
  attributes :name
  has_one :teacher
end
