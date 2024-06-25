# frozen_string_literal: true

require 'rails_helper'
require 'sidekiq/testing'

RSpec.describe SyncDistrictDataFromUrlWorker, type: :worker do
  let(:url) { 'http://example.com/districts' }

  let(:response_body) do
    {
      'results' => [
        {
          'lea_name' => 'Example District',
          'leaid' => '654321',
          'city_location' => 'Anytown',
          'state_location' => 'CA',
          'zip_location' => '12345',
          'phone' => '555-1234',
          'number_of_schools' => '10',
          'enrollment' => '2000',
          'lowest_grade_offered' => 'K',
          'highest_grade_offered' => '12'
        }
      ],
      'next' => nil
    }.to_json
  end

  let(:response_school) { JSON.parse(response_body)['results'][0] }

  before do
    stub_request(:get, url).to_return(body: response_body, headers: { 'Content-Type' => 'application/json' })
  end

  it 'enqueues the worker' do
    expect {
      SyncDistrictDataFromUrlWorker.perform_async(url)
    }.to change(SyncDistrictDataFromUrlWorker.jobs, :size).by(1)
  end

  it 'fetches data from the URL and processes the districts' do
    expect {
      SyncDistrictDataFromUrlWorker.new.perform(url)
    }.to change(District, :count).by(1)

    district = District.last

    expect(district.name).to eq(response_school['lea_name'])
    expect(district.nces_id).to eq(response_school['leaid'].to_i)
    expect(district.city).to eq(response_school['city_location'])
    expect(district.state).to eq(response_school['state_location'])
    expect(district.zipcode).to eq(response_school['zip_location'])
    expect(district.phone).to eq(response_school['phone'])
    expect(district.total_schools).to eq(response_school['number_of_schools'].to_i)
    expect(district.total_students).to eq(response_school['enrollment'].to_i)
    expect(district.grade_range).to eq("#{response_school['lowest_grade_offered']} - #{response_school['highest_grade_offered']}")
  end

  it 'updates an existing district if it is already present' do
    district = District.create!(nces_id: 654321, name: 'Old District')

    expect {
      SyncDistrictDataFromUrlWorker.new.perform(url)
    }.not_to change(District, :count)

    district.reload

    expect(district.name).to eq(response_school['lea_name'])
    expect(district.nces_id).to eq(response_school['leaid'].to_i)
    expect(district.city).to eq(response_school['city_location'])
    expect(district.state).to eq(response_school['state_location'])
    expect(district.zipcode).to eq(response_school['zip_location'])
    expect(district.phone).to eq(response_school['phone'])
    expect(district.total_schools).to eq(response_school['number_of_schools'].to_i)
    expect(district.total_students).to eq(response_school['enrollment'].to_i)
    expect(district.grade_range).to eq("#{response_school['lowest_grade_offered']} - #{response_school['highest_grade_offered']}")
  end

  it 'handles pagination and enqueues next job if next URL is present' do
    response_body_with_next = {
      'results' => [
        {
          'lea_name' => 'First District',
          'leaid' => '123456',
          'city_location' => 'Townsville',
          'state_location' => 'TX',
          'zip_location' => '54321',
          'phone' => '555-5678',
          'number_of_schools' => '5',
          'enrollment' => '1000',
          'lowest_grade_offered' => 'K',
          'highest_grade_offered' => '12'
        }
      ],
      'next' => 'http://example.com/districts?page=2'
    }.to_json

    stub_request(:get, url).to_return(body: response_body_with_next, headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, 'http://example.com/districts?page=2').to_return(body: response_body, headers: { 'Content-Type' => 'application/json' })

    expect {
      SyncDistrictDataFromUrlWorker.new.perform(url)
    }.to change(SyncDistrictDataFromUrlWorker.jobs, :size).by(1)

    first_district = District.find_by(nces_id: JSON.parse(response_body_with_next)['results'][0]['leaid'].to_i)
    expect(first_district).not_to be_nil
    expect(first_district.name).to eq(JSON.parse(response_body_with_next)['results'][0]['lea_name'])

    SyncDistrictDataFromUrlWorker.drain

    second_district = District.find_by(nces_id: response_school['leaid'].to_i)
    expect(second_district).not_to be_nil
    expect(second_district.name).to eq(response_school['lea_name'])
  end
end
