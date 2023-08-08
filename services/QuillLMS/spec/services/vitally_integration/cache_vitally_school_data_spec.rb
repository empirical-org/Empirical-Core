# frozen_string_literal: true

require 'rails_helper'

describe VitallyIntegration::CacheVitallySchoolData do
  subject { described_class }

  let(:school_id) { 1 }
  let(:year) { 2000 }

  it '#cache_key' do
    expect(subject.cache_key(school_id, year)).to eq("school_id:#{school_id}_vitally_stats_for_year_#{year}")
  end

  it '#set' do
    data = {test: 1}
    expect($redis).to receive(:set).with("school_id:#{school_id}_vitally_stats_for_year_#{year}", data.to_json, {ex: 1.year})
    subject.set(school_id, year, data.to_json)
  end

  it '#del' do
    expect($redis).to receive(:del).with("school_id:#{school_id}_vitally_stats_for_year_#{year}")
    subject.del(school_id, year)
  end

  it '#get' do
    expect($redis).to receive(:get).with("school_id:#{school_id}_vitally_stats_for_year_#{year}")
    subject.get(school_id, year)
  end
end
