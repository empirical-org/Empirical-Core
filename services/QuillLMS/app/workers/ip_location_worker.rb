# frozen_string_literal: true

class IpLocationWorker
  include Sidekiq::Worker
  API_KEY = ENV["POINTPIN_KEY"]
  BASE_URL = 'https://geo.pointp.in'

  class PinpointAPIError < StandardError; end

  def perform(id, ip_address, blacklist = [])
    return if ENV.fetch('SKIP_IP_LOCATION_WORKER', 'false') == 'true'

    user = User.find(id)
    response = HTTParty.get(pinpoint_url(ip_address))

    if !response.success?
      raise PinpointAPIError, "#{response.code}: #{response}"
    end

    postcode = response["postcode"]

    return if blacklist.include?(postcode)

    IpLocation.create(
      country: response["country_name"],
      state: response["region_name"],
      city: response["city_name"],
      # TODO: We should convert the zip DB field to a string
      # postcodes can be non-numbers internationally, and we want leading zeros
      zip: postcode.to_i,
      user_id: user.id
    )
  end

  private def pinpoint_url(ip_address)
    "#{BASE_URL}/#{API_KEY}/json/#{ip_address}"
  end
end
