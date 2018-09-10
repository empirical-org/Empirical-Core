class ReferrerUser < ActiveRecord::Base
  belongs_to :user

  ENV_VARIABLE_NAME = 'referral_code'
end
