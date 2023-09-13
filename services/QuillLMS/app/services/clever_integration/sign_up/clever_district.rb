# frozen_string_literal: true

module CleverIntegration::SignUp::CleverDistrict

  def self.run(auth_hash)
    district_data = CleverIntegration::DistrictDataAdapter.run(auth_hash)
    district = CleverIntegration::Creators::CleverDistrict.run(district_data)
    {type: 'district_success', data: district}
  end
end
