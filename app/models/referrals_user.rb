class ReferralsUser < ActiveRecord::Base
  belongs_to :user
  has_one :referred_user, class_name: 'User', foreign_key: :id, primary_key: :referred_user_id
end
