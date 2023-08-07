# frozen_string_literal: true

require 'rails_helper'

RSpec.describe VitallyIntegration::CacheVitallySchoolData do
  subject { described_class }

  let(:school_id) { 1 }
  let(:year) { 2000 }
  let(:cache_key) { "school_id:#{school_id}_vitally_stats_for_year_#{year}" }

  it { expect(subject.cache_key(school_id, year)).to eq(cache_key) }

  it '#set' do
    data = {test: 1}
    expect(Rails.cache).to receive(:write).with(cache_key, data.to_json, expires_in: 1.year)
    subject.set(school_id, year, data.to_json)
  end

  it '#del' do
    expect(Rails.cache).to receive(:delete).with(cache_key)
    subject.del(school_id, year)
  end

  it '#get' do
    expect(Rails.cache).to receive(:read).with(cache_key)
    subject.get(school_id, year)
  end
end
