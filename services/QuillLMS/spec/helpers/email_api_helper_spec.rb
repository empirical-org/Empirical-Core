require 'rails_helper'

describe EmailApiHelper do

  start_time = Time.now.yesterday.beginning_of_day
  end_time = Time.now.yesterday.end_of_day

  describe '#parse_nps_response' do
    it 'should return the parsed response for the Satismeter response statistics API' do
        mock_response = ({
            'data': [
                {
                    'attributes': {
                        'nps': 73.33333333333333,
                        'promoters': 11,
                        'passives': 4,
                        'detractors': 0
                    }
                }
            ]
        }).as_json
        mock_result = ({
            'nps': 73.33,
            'respondents': [11, 4, 0]
        }).as_json

        result = parse_nps_response(mock_response)
        expect(result).to eq(mock_result)
    end
  end

  describe '#parse_comment_response' do
    it 'should return the parsed response for the Satismeter responses API' do
        mock_response = ({
            'responses': [
                { 'feedback': 'this is great!', 'rating': 10 },
                { 'feedback': nil, 'rating': 7 },
                { 'feedback': 'meh', 'rating': 5 }
            ]
        }).as_json
        mock_result = ([
            { 'feedback': 'this is great!', 'rating': 10 },
            { 'feedback': 'meh', 'rating': 5 }
        ]).as_json

        result = parse_comment_response(mock_response)
        expect(result).to eq(mock_result)
    end
  end

  describe '#get_satismeter_nps_data' do
    it 'should return the response from the Satismeter response statistics API' do
        uri = URI.parse("https://app.satismeter.com/api/v2/response-statistics?startDate=#{start_time}&endDate=#{end_time}&project=#{ENV['SATISMETER_PROJECT_KEY']}")
        request = Net::HTTP::Get.new(uri)
        request["Authkey"] = ENV['SATISMETER_AUTH_KEY']
        req_options = { use_ssl: uri.scheme == "https" }
        response = Net::HTTP.start(uri.hostname, uri.port, req_options) { |http| http.request(request) }

        response1 = parse_nps_response(JSON.parse(response.body))
        response2 = get_satismeter_nps_data(start_time, end_time)
        expect(response1).to eq(response2)
    end
  end

  describe '#get_satismeter_comment_data' do
    it 'should return the response from the Satismeter responses API' do
        uri = URI.parse("https://app.satismeter.com/api/responses?format=json&project=#{ENV['SATISMETER_PROJECT_KEY']}&startDate=#{start_time}&endDate=#{end_time}")
        request = Net::HTTP::Get.new(uri)
        request.basic_auth(ENV['SATISMETER_AUTH_KEY'], "")
        req_options = { use_ssl: uri.scheme == "https" }
        response = Net::HTTP.start(uri.hostname, uri.port, req_options) { |http| http.request(request) }

        response1 = parse_comment_response(JSON.parse(response.body))
        response2 = get_satismeter_comment_data(start_time, end_time)
        expect(response1).to eq(response2)
    end
  end

  describe '#get_intercom_data' do
    it 'should return the count of closed conversations from the Intercom conversations API' do
        count = get_intercom_data(start_time, end_time)
        expect(count).to be_instance_of(Integer)
    end
  end

end