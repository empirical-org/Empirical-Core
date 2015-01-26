class ActivitySerializer < ActiveModel::Serializer
  attributes :uid, :id, :name, :description, :flags, :data, :created_at, :updated_at

  has_one :classification, serializer: ClassificationSerializer
  has_one :topic

end
