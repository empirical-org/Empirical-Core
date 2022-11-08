# frozen_string_literal: true

require 'rails_helper'

describe SegmentAnalyticsUserSerializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:user) }
    let(:result_key) { "segment_analytics_user" }

    let(:expected_serialized_keys) do
      %w{
        email
        created_at
        id
        name
        role
        active
        classcode
        username
        ip_address
        subscription
        school
        time_zone
      }
    end
  end
end
