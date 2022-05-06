# frozen_string_literal: true

require 'rails_helper'

describe EmailApiHelper do

  start_time = Time.current.yesterday.beginning_of_day
  end_time = Time.current.yesterday.end_of_day
  mock_nps_response = {
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
    }
  mock_comment_response = {
       'responses': [
           { 'feedback': 'this is great!', 'rating': 10 },
           { 'feedback': nil, 'rating': 7 },
           { 'feedback': 'meh', 'rating': 5 }
       ]
   }

  describe '#parse_nps_response' do
    it 'should return the parsed response for the Satismeter response statistics API' do
      mock_result = ({
          'nps': 73.33,
          'respondents': [11, 4, 0]
      }).as_json

      result = parse_nps_response(mock_nps_response.as_json)
      expect(result).to eq(mock_result)
    end
  end

  describe '#parse_comment_response' do
    it 'should return the parsed response for the Satismeter responses API' do
      mock_result = ([
          { 'feedback': 'this is great!', 'rating': 10 },
          { 'feedback': 'meh', 'rating': 5 }
      ]).as_json

      result = parse_comment_response(mock_comment_response.as_json)
      expect(result).to eq(mock_result)
    end
  end

  describe '#get_satismeter_nps_data' do
    it 'should return the response from the Satismeter response statistics API' do
      uri = URI.parse("https://app.satismeter.com/api/v2/response-statistics?startDate=#{start_time}&endDate=#{end_time}&project=#{ENV['SATISMETER_PROJECT_KEY']}")
      stub_request(:get, uri).to_return(body: mock_nps_response.to_json)
      get_satismeter_nps_data(start_time, end_time)
      expect(WebMock).to have_requested(:get, uri).once
    end
  end

  describe '#get_satismeter_comment_data' do
    it 'should return the response from the Satismeter responses API' do
      uri = URI.parse("https://app.satismeter.com/api/responses?format=json&project=#{ENV['SATISMETER_PROJECT_KEY']}&startDate=#{start_time}&endDate=#{end_time}")
      stub_request(:get, uri).to_return(body: mock_comment_response.to_json)
      get_satismeter_comment_data(start_time, end_time)
      expect(WebMock).to have_requested(:get, uri).once
    end
  end

  describe '#get_intercom_data' do
    it 'should return the count of closed conversations from the Intercom conversations API' do
      mock_response = double('mock_response', { open: false, updated_at: Time.current })
      conversation_list = class_double("ConversationList")
      allow(conversation_list).to receive(:find_all).with({open: false, sort_by: "updated_at", order: "desc"}).and_return([mock_response])
      expect_any_instance_of(Intercom::Client).to receive(:conversations).and_return(conversation_list)
      get_intercom_data(start_time, end_time)
    end
  end

end
