class IpLocationWorker
  include Sidekiq::Worker

  def perform(id, ip_address, blacklist = [])
    @user = User.find(id)
    location = Pointpin.locate(ip_address)
    postcode = location ? location["postcode"] : nil
    country_name = location ? location["country_name"] : nil
    region_name = location ? location["region_name"] : nil
    city_name = location ? location["city_name"] : nil
    unless blacklist.include?(postcode)
      new_ip_location = IpLocation.new
      IpLocation.create(country: country_name, state: region_name, city: city_name, zip: postcode.to_i, user_id: @user.id)
    end
  end
end
