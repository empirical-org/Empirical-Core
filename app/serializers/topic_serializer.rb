class TopicSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at

  has_one :section
  has_one :topic_category

end
