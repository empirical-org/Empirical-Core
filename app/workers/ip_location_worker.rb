class IpLocationWorker
  include Sidekiq::Worker

  def perform(id, ip_address)
    puts "\n\n\n\n\n\n\n\n\n\n\n\n\n\n#{ip_address}\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
    @user = User.find(id)
    location = Pointpin.locate(ip_address)
    puts "\n\n\n\n\n\n\n\n\n\n\n\n\n\n#{location}\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
    new_ip_location = IpLocation.new
    IpLocation.create(country: location["country_name"], state: location["region_name"], city: location["city_name"], zip: location["post_code"], user_id: @user.id)
  end

end
