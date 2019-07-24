class IpLocationWorker
  include Sidekiq::Worker

  def perform(id, ip_address, blacklist = [])
    @user = User.find(id)
    location = Pointpin.locate(ip_address)
    unless blacklist.include?(location["postcode"])
      new_ip_location = IpLocation.new
      IpLocation.create(country: location["country_name"], state: location["region_name"], city: location["city_name"], zip: location["postcode"].to_i, user_id: @user.id)
    end
  end
end
