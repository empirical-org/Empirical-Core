class IpLocationWorker
  include Sidekiq::Worker

  def perform(id, ip_address)
    @user = User.find(id)
    location = Pointpin.locate(ip_address)
    unless location["postcode"] == ("10005" || "11237" || "11385") #locations where we've had offices and therefore triggered a ton of false ip addresses
      new_ip_location = IpLocation.new
      IpLocation.create(country: location["country_name"], state: location["region_name"], city: location["city_name"], zip: location["postcode"].to_i, user_id: @user.id)
    end
  end

end
