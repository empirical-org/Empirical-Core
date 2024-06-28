# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SyncSchoolDataFromUrlWorker, type: :worker do
  let(:url) { 'http://example.com/schools' }
  let(:response_body) do
    {
      'results' => [
        {
          'school_name' => 'Example School',
          'ncessch_num' => '123456',
          'street_location' => '123 Main St',
          'city_location' => 'Anytown',
          'state_location' => 'CA',
          'zip_location' => '12345',
          'phone' => '555-1234',
          'street_mailing' => '123 Main St',
          'city_mailing' => 'Anytown',
          'state_mailing' => 'CA',
          'zip_mailing' => '12345',
          'school_type' => '1',
          'school_status' => '1',
          'magnet' => '1',
          'charter' => '0',
          'longitude' => '-118.2437',
          'latitude' => '34.0522',
          'urban_centric_locale' => '11',
          'teachers_fte' => '50',
          'free_or_reduced_price_lunch' => '100',
          'direct_certification' => '50',
          'enrollment' => '200',
          'leaid' => '654321'
        }
      ],
      'next' => nil
    }.to_json
  end

  let(:response_school) { JSON.parse(response_body)['results'][0]}

  before do
    stub_request(:get, url).to_return(body: response_body, headers: { 'Content-Type' => 'application/json' })
  end

  it 'enqueues the worker' do
    expect {
      SyncSchoolDataFromUrlWorker.perform_async(url)
    }.to change(SyncSchoolDataFromUrlWorker.jobs, :size).by(1)
  end

  it 'fetches data from the URL and processes the schools' do
    district = District.create!(nces_id: 654321, name: 'Example District')

    expect {
      SyncSchoolDataFromUrlWorker.new.perform(url)
    }.to change(School, :count).by(1)

    school = School.last

    expect(school.name).to eq(response_school['school_name'])
    expect(school.nces_id).to eq(response_school['ncessch_num'])
    expect(school.street).to eq(response_school['street_location'])
    expect(school.city).to eq(response_school['city_location'])
    expect(school.state).to eq(response_school['state_location'])
    expect(school.zipcode).to eq(response_school['zip_location'])
    expect(school.phone).to eq(response_school['phone'])
    expect(school.mail_street).to eq(response_school['street_mailing'])
    expect(school.mail_city).to eq(response_school['city_mailing'])
    expect(school.mail_state).to eq(response_school['state_mailing'])
    expect(school.mail_zipcode).to eq(response_school['zip_mailing'])
    expect(school.nces_type_code).to eq(response_school['school_type'])
    expect(school.nces_status_code).to eq(response_school['school_status'])
    expect(school.magnet).to eq(response_school['magnet'])
    expect(school.charter).to eq(response_school['charter'])
    expect(school.longitude).to eq(response_school['longitude'].to_f)
    expect(school.latitude).to eq(response_school['latitude'].to_f)
    expect(school.ulocal).to eq(response_school['urban_centric_locale'].to_i)
    expect(school.fte_classroom_teacher).to eq(response_school['teachers_fte'].to_i)
    expect(school.free_lunches).to eq((response_school["free_or_reduced_price_lunch"].to_i / response_school["enrollment"].to_f * 100).to_i)
    expect(school.direct_certification).to eq((response_school["direct_certification"].to_i / response_school["enrollment"].to_f * 100).to_i)
    expect(school.total_students).to eq(response_school['enrollment'].to_i)
    expect(school.district_id).to eq(district.id)
  end

  it 'updates an existing school if it is already present' do
    district = District.create!(nces_id: 654321, name: 'Example District')
    original_school_name = 'Old Name'
    school = School.create!(nces_id: '0123456', name: original_school_name, district_id: district.id)

    expect {
      SyncSchoolDataFromUrlWorker.new.perform(url)
    }.not_to change(School, :count)

    school.reload

    expect(school.name).to eq(original_school_name) # name should not be updated
    expect(school.nces_id).to eq(response_school['ncessch_num'])
    expect(school.street).to eq(response_school['street_location'])
    expect(school.city).to eq(response_school['city_location'])
    expect(school.state).to eq(response_school['state_location'])
    expect(school.zipcode).to eq(response_school['zip_location'])
    expect(school.phone).to eq(response_school['phone'])
    expect(school.mail_street).to eq(response_school['street_mailing'])
    expect(school.mail_city).to eq(response_school['city_mailing'])
    expect(school.mail_state).to eq(response_school['state_mailing'])
    expect(school.mail_zipcode).to eq(response_school['zip_mailing'])
    expect(school.nces_type_code).to eq(response_school['school_type'])
    expect(school.nces_status_code).to eq(response_school['school_status'])
    expect(school.magnet).to eq(response_school['magnet'])
    expect(school.charter).to eq(response_school['charter'])
    expect(school.longitude).to eq(response_school['longitude'].to_f)
    expect(school.latitude).to eq(response_school['latitude'].to_f)
    expect(school.ulocal).to eq(response_school['urban_centric_locale'].to_i)
    expect(school.fte_classroom_teacher).to eq(response_school['teachers_fte'].to_i)
    expect(school.free_lunches).to eq((response_school["free_or_reduced_price_lunch"].to_i / response_school["enrollment"].to_f * 100).to_i)
    expect(school.direct_certification).to eq((response_school["direct_certification"].to_i / response_school["enrollment"].to_f * 100).to_i)
    expect(school.total_students).to eq(response_school['enrollment'].to_i)
    expect(school.district_id).to eq(district.id)
  end
end
