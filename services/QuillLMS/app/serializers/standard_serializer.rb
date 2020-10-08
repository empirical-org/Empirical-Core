class StandardSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at

  has_one :standard_level
  has_one :standard_category
end
