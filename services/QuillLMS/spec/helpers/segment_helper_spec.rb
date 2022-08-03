# frozen_string_literal: true

require 'rails_helper'

describe SegmentioHelper do
  let!(:user) {create(:teacher, :premium)}

  describe '#generate_segment_identify_arguments' do
    it 'should construct a series of three javascript-parsable "function arguments"' do
      argument_string = generate_segment_identify_arguments(user)
      universal_user_argument = serialize_user(user).merge(intercom_properties(user)).to_json
      destination_specific_argument = destination_properties(user).to_json
      expected_argument_string = "#{user.id}, #{universal_user_argument}, #{destination_specific_argument}"
      expect(argument_string).to eq(expected_argument_string)
    end
  end

  describe '#serialize_user' do
    it 'should return the expected serialization parameters' do
      serialization = serialize_user(user)
      expected_serialization = {
        userType: user.role,
        createdAt: user.created_at,
        daysSinceJoining: ((Time.current - user.created_at) / 60 / 60 / 24).to_i
      }
      expect(serialization).to eq(expected_serialization)
    end
  end

  describe '#destination_properties' do
    it 'should flag data to go to all integrations' do
      properties = destination_properties(user)
      expect(properties[:all]).to eq(true)
      properties.each_value do |value|
        expect(value).not_to eq(false)
      end
      expect(properties.keys).to include(:all)
    end

    it 'should load intercom-specific property data when requested' do
      properties = destination_properties(user)
      expect(properties.keys).to eq([:all, :Intercom])
    end

    it 'should provide a shared-secret signature for Intercom by hashing the user id' do
      properties = destination_properties(user)
      user_hash = OpenSSL::HMAC.hexdigest('sha256', ENV['INTERCOM_APP_SECRET'], user.id.to_s)
      expect(properties[:Intercom][:user_hash]).to eq(user_hash)
    end
  end

  describe '#intercom_properties' do
    it 'should include Intercom-specific PII and nothing else' do
      properties = intercom_properties(user)
      expect(properties.keys).to eq([:first_name, :adams_name, :email])
    end
  end

  describe '#format_analytics_properties' do
    RequestStruct = Struct.new(:fullpath, :referrer)

    it 'should include request path' do
      request = RequestStruct.new('mock://full.path', nil)
      formatted_properties = format_analytics_properties(request, {})
      expect(formatted_properties[:path]).to eq(request.fullpath)
    end

    it 'should include request referrer' do
      request = RequestStruct.new(nil, 'mock://referrer.path')
      formatted_properties = format_analytics_properties(request, {})
      expect(formatted_properties[:referrer]).to eq(request.referrer)
    end

    it 'should prepend "custom_" to all properties and include the result' do
      request = RequestStruct.new(nil, nil)
      properties = {
        'test1': 1,
        'test2': 2,
      }
      formatted_properties = format_analytics_properties(request, properties)
      properties.keys.each do |property|
        expect(formatted_properties).to include("custom_#{property}")
      end
    end

  end
end
