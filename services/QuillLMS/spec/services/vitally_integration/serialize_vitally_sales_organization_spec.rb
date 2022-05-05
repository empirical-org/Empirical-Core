# frozen_string_literal: true

require 'rails_helper'

describe 'SerializeVitallyOrganizationAccount' do
  let!(:district) { create(:district, name: 'Kool District') }

  it 'includes the necessary attributes' do
    district_data = SerializeVitallySalesOrganization.new(district).data

    expect(district_data).to include(organizationId: district.id.to_s)
    expect(district_data[:traits]).to include(
      name: district.name,
      nces_id: district.nces_id,
      clever_id: district.clever_id,
      city: district.city,
      state: district.state,
      zipcode: district.zipcode,
      phone: district.phone,
      total_students: district.total_students,
      total_schools: district.total_schools
    )
  end
end
