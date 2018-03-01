class SubscriptionSerializer < ActiveModel::Serializer
  attributes :id, :expiration, :account_limit, :errors
end
