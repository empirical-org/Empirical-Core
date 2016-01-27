class IpLocationWorker
  include Sidekiq::Worker

  def perform(id, ip_address)
    ip_address = "72.69.133.250"
    @user = User.find(id)

    location = Pointpin.locate(ip_address)
    new_ip_location = IpLocation.new
    # new_ip_location.country = location["country_code"]
    new_ip_location.state = location["region_name"]
    new_ip_location.city = location["city_name"]
    new_ip_location.zip = location["zip_code"]
    new_ip_location.save!
    binding.pry
    puts "you reached meeeeeeeeee!!!! \n \n \n\n\n\n\ "

  end

end
