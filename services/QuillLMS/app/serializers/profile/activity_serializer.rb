class Profile::ActivitySerializer < ActiveModel::Serializer
  attributes :name, :description, :repeatable
  has_one :topic
  has_one :section
  has_one :classification
end
