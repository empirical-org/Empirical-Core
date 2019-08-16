class IpLocationWorker
  include Sidekiq::Worker

  def perform(id, ip_address, blacklist = [])
    @user = User.find(id)
    location = Pointpin.locate(ip_address)
    postcode = location ? location["postcode"] : nil
    unless blacklist.include?(postcode)
      new_ip_location = IpLocation.new
      IpLocation.create(country: location["country_name"], state: location["region_name"], city: location["city_name"], zip: postcode.to_i, user_id: @user.id)
    end
  end
end
