class IpLocationWorker
  include Sidekiq::Worker

  def perform(id, ip_address)
    @user = User.find(id)
    location = Pointpin.locate(ip_address)
    unless location["post_code"] == "10005" #blocks our zip from creating accounts so they don't disrupt database accuracy
      new_ip_location = IpLocation.new
      IpLocation.create(country: location["country_name"], state: location["region_name"], city: location["city_name"], zip: location["post_code"].to_i, user_id: @user.id)
    end
  end

end
