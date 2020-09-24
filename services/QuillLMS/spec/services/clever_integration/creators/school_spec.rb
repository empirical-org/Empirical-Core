require 'rails_helper'

describe 'CleverIntegration::Creators::School' do

  let!(:nces_school) { create(:school, nces_id: 'NCES_ID') }
  let!(:clever_school) { create(:school, nces_id: nil, clever_id: 'CLEVER_ID') }

  let(:nces_match) {
    {
      id: clever_school.clever_id,
      nces_id: nces_school.nces_id
    }
  }

  let(:nces_mismatch) {
    {
      id: clever_school.clever_id,
      nces_id: 'NO_MATCH'
    }
  }

  let(:nces_missing) {
    {
      id: clever_school.clever_id
    }
  }

  let(:both_mismatch) {
    {
      id: 'NO_MATCH',
      nces_id: 'NO_MATCH'
    }
  }

  it 'will find the school by NCES if one is present in the payload' do
    school = CleverIntegration::Creators::School.run(nces_match)
    expect(school).to eq(nces_school)
  end

  it 'will fall back to Clever ID if NCES is missing' do
    school = CleverIntegration::Creators::School.run(nces_missing)
    expect(school).to eq(clever_school)
  end

  it 'will fall back to Clever ID if NCES is present, but there is no matching school' do
    school = CleverIntegration::Creators::School.run(nces_mismatch)
    expect(school).to eq(clever_school)
  end

  it 'will return nil if no Clever ID or NCES ID is present in payload' do
    school = CleverIntegration::Creators::School.run({})
    expect(school).to be_nil
  end

  it 'will return nil if neither Clever ID nor NCES ID match a school' do
    school = CleverIntegration::Creators::School.run(both_mismatch)
    expect(school).to be_nil
  end
end

