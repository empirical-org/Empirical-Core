class Profile::ActivitySerializer < ActiveModel::Serializer
  attributes :name, :description
  has_one :topic
  has_one :section
  has_one :classification
end
