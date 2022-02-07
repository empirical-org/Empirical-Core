# frozen_string_literal: true

require 'net/http'

module EmailApiHelper
  def parse_nps_response(response)
    result = {}
    if response['data'] && response['data'][0] && response['data'][0]['attributes']
      data = response['data'][0]['attributes']
      result['nps'] = data['nps'].round(2)
      result['respondents'] = [data['promoters'], data['passives'], data['detractors']]
    end
    result
  end

  def parse_comment_response(response)
    results = []
    if response['responses']
      response['responses'].each do |resp|
        # only collect feedback responses if there was a comment left
        if resp['feedback']
          result = {}
          result['rating'] = resp['rating']
          result['feedback'] = resp['feedback']
          results << result
        end
      end
    end
    results
  end

  def get_satismeter_nps_data(start_time, end_time)
    uri = URI.parse("https://app.satismeter.com/api/v2/response-statistics?startDate=#{start_time}&endDate=#{end_time}&project=#{ENV['SATISMETER_PROJECT_KEY']}")
    request = Net::HTTP::Get.new(uri)
    request["Authkey"] = ENV['SATISMETER_AUTH_KEY']
    req_options = { use_ssl: uri.scheme == "https" }
    response = Net::HTTP.start(uri.hostname, uri.port, req_options) { |http| http.request(request) }
    parse_nps_response(JSON.parse(response.body)) if response.is_a?(Net::HTTPSuccess)
  end

  def get_satismeter_comment_data(start_time, end_time)
    uri = URI.parse("https://app.satismeter.com/api/responses?format=json&project=#{ENV['SATISMETER_PROJECT_KEY']}&startDate=#{start_time}&endDate=#{end_time}")
    request = Net::HTTP::Get.new(uri)
    request.basic_auth(ENV['SATISMETER_AUTH_KEY'], "")
    req_options = { use_ssl: uri.scheme == "https" }
    response = Net::HTTP.start(uri.hostname, uri.port, req_options) { |http| http.request(request) }
    parse_comment_response(JSON.parse(response.body)) if response.is_a?(Net::HTTPSuccess)
  end

  def get_intercom_data(start_time, end_time)
    # The Intercom API has a before key to fetch all conversations before a certain time, but it does not yet
    # have support for fetching conversations closed after a certain time, so this is the most efficient way to handle this case
    # https://github.com/intercom/intercom-ruby/issues/377
    intercom = Intercom::Client.new(token: ENV['INTERCOM_ACCESS_TOKEN'])
    closed_conversations = []
    intercom.conversations.find_all(open: false, sort_by: 'updated_at', order: 'desc').each do |convo|
      convo.updated_at > start_time ? closed_conversations << convo : break
    end
    closed_conversations.length
  end
end
