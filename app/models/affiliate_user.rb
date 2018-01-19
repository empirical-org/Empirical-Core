class AffiliateUser < ActiveRecord::Base
  self.table_name = 'affiliate_user'

  belongs_to :user
end
