# == Schema Information
#
# Table name: referrer_users
#
#  id            :integer          not null, primary key
#  referral_code :string           not null
#  created_at    :datetime
#  updated_at    :datetime
#  user_id       :integer          not null
#
# Indexes
#
#  index_referrer_users_on_referral_code  (referral_code) UNIQUE
#  index_referrer_users_on_user_id        (user_id) UNIQUE
#
class ReferrerUser < ActiveRecord::Base
  belongs_to :user

end
