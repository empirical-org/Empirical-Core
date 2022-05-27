# frozen_string_literal: true

class SerializeVitallySalesOrganization

  def initialize(district)
    @district = district
  end

  def data
    {
      externalId: @district.id.to_s,
      name: @district.name,
      traits: {
        name: @district.name,
        nces_id: @district.nces_id || "",
        clever_id: @district.clever_id || "",
        city: @district.city || "",
        state: @district.state || "",
        zipcode: @district.zipcode || "",
        phone: @district.phone || "",
        total_students: @district.total_students || "",
        total_schools: @district.total_schools || ""
      }
    }
  end
end
