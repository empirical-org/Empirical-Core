class IpLocation < ActiveRecord::Base

  # has_many :users, through: :ip_locations_users
  has_and_belongs_to_many :users

  def self.get_location(ip_address)
    binding.pry
  end
end
