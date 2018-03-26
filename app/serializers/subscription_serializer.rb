class SubscriptionSerializer < ActiveModel::Serializer
  attributes :id, :expiration, :errors
end
