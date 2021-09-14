require 'rails_helper'

describe CacheVitallyTeacherData do
  let!(:teacher_id) { 1 }
  let!(:year) { 2000 }

  it '#cache_key' do
    expect(CacheVitallyTeacherData.cache_key(teacher_id, year)).to eq("teacher_id:#{teacher_id}_vitally_stats_for_year_#{year}")
  end

  it '#set' do
    data = {test: 1}
    expect($redis).to receive(:set).with("teacher_id:#{teacher_id}_vitally_stats_for_year_#{year}", data.to_json, {ex: 1.year})
    CacheVitallyTeacherData.set(teacher_id, year, data.to_json)
  end

  it '#del' do
    expect($redis).to receive(:del).with("teacher_id:#{teacher_id}_vitally_stats_for_year_#{year}")
    CacheVitallyTeacherData.del(teacher_id, year)
  end

  it '#get' do
    expect($redis).to receive(:get).with("teacher_id:#{teacher_id}_vitally_stats_for_year_#{year}")
    CacheVitallyTeacherData.get(teacher_id, year)
  end
end
