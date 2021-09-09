require 'rails_helper'

describe CacheVitallySchoolData do
  let!(:school_id) { 1 }
  let!(:year) { 2000 }

  it '#cache_key' do
    expect(CacheVitallySchoolData.cache_key(school_id, year)).to eq("school_id:#{school_id}_vitally_stats_for_year_#{year}")
  end

  it '#set' do
    data = {test: 1}
    expect($redis).to receive(:set).with("school_id:#{school_id}_vitally_stats_for_year_#{year}", data.to_json, {ex: 1.year})
    CacheVitallySchoolData.set(school_id, year, data.to_json)
  end

  it '#del' do
    expect($redis).to receive(:del).with("school_id:#{school_id}_vitally_stats_for_year_#{year}")
    CacheVitallySchoolData.del(school_id, year)
  end

  it '#get' do
    expect($redis).to receive(:get).with("school_id:#{school_id}_vitally_stats_for_year_#{year}")
    CacheVitallySchoolData.get(school_id, year)
  end
end
