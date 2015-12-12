class SubscriptionSerializer < ActiveModel::Serializer
  attributes :id, :expiration, :account_limit, :user_id, :errors
end
