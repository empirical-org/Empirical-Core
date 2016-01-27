class IpLocation < ActiveRecord::Base

  has_many :users, through: :ip_locations_users
end
