require 'net/http'

module SatismeterHelper

  def self.get_data(start_time, end_time)
    project_key = '5cd1c9a1e1455c000484d971'
    uri = URI.parse("https://app.satismeter.com/api/v2/response-statistics?startDate=#{start_time}&endDate=#{end_time}&project=#{project_key}")
    request = Net::HTTP::Get.new(uri)
    request["Authkey"] = "jCdQ95Pla6Jl3Plg"
    req_options = {
      use_ssl: uri.scheme == "https",
    }
    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end
    JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)
  end

end
