class Profile::ActivitySerializer < ActiveModel::Serializer
  attributes :name, :description, :repeatable
  has_one :standard
  has_one :standard_level
  has_one :classification
end
