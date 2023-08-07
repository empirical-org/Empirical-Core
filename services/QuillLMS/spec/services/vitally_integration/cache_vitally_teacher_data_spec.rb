# frozen_string_literal: true

require 'rails_helper'

describe VitallyIntegration::CacheVitallyTeacherData do
  subject { described_class }

  let(:teacher_id) { 1 }
  let(:year) { 2000 }
  let(:cache_key) { "teacher_id:#{teacher_id}_vitally_stats_for_year_#{year}" }

  it { expect(subject.cache_key(teacher_id, year)).to eq(cache_key) }

  it '#set' do
    data = {test: 1}
    expect(Rails.cache).to receive(:write).with(cache_key, data.to_json, expires_in: 1.year)
    subject.set(teacher_id, year, data.to_json)
  end

  it '#del' do
    expect(Rails.cache).to receive(:delete).with(cache_key)
    subject.del(teacher_id, year)
  end

  it '#get' do
    expect(Rails.cache).to receive(:read).with(cache_key)
    subject.get(teacher_id, year)
  end
end
