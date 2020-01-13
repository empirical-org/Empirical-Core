require 'net/http'

module SatismeterHelper
  def parse_nps_response(response)
    result = {}
    if response['data'] && response['data'][0] && response['data'][0]['attributes']
      data = response['data'][0]['attributes']
      result['nps'] = data['nps']
      result['respondents'] = [data['promoters'], data['passives'], data['detractors']]
    end
    result
  end

  def parse_comment_response(response)
    results = []
    response['responses'] && response['responses'].each do |resp|
      # only collect feedback responses if there was a comment left
      if resp['feedback']
        result = {}
        result['rating'] = resp['rating']
        result['feedback'] = resp['feedback']
        results << result
      end     
    end
    results
  end

  def get_satismeter_nps_data(start_time, end_time)
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
   parse_nps_response(JSON.parse(response.body)) if response.is_a?(Net::HTTPSuccess)
  end

  def get_satismeter_comment_data(start_time, end_time)
    project_key = '5cd1c9a1e1455c000484d971'
    uri = URI.parse("https://app.satismeter.com/api/responses?format=json&project=#{project_key}&startDate=#{start_time}&endDate=#{end_time}")
    request = Net::HTTP::Get.new(uri)
    request.basic_auth("jCdQ95Pla6Jl3Plg", "")
    req_options = {
      use_ssl: uri.scheme == "https",
    }
    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end
    parse_comment_response(JSON.parse(response.body)) if response.is_a?(Net::HTTPSuccess)
  end
end
