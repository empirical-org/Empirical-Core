class IpLocation < ActiveRecord::Base

  # has_many :users, through: :ip_locations_users
  belongs_to :user

  def self.get_location(ip_address)
    binding.pry
  end
end
