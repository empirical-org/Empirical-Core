# frozen_string_literal: true

class Profile::ActivitySerializer < ApplicationSerializer
  attributes :name, :description, :repeatable
  has_one :standard
  has_one :standard_level
  has_one :classification
end
