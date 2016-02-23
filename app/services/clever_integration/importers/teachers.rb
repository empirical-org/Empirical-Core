module CleverIntegration::Importers::Teachers

  def self.run(district)
    CleverIntegration::Importers::Helpers::Teachers.run(district, self.district_requester)
  end

  private

  def self.district_requester
    lambda do |clever_id, district_token|
      Clever::District.retrieve(clever_id, district_token)
    end
  end
end