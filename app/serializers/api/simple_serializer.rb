class Api::SimpleSerializer < ActiveModel::Serializer
  attributes :uid, :name
end