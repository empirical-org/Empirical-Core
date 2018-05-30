module CleverIntegration::Parsers::DistrictFromAuth

  def self.run(auth_hash)
    {
      clever_id: auth_hash[:info][:id],
      name: auth_hash[:info][:name],
      token: auth_hash[:credentials][:token]
    }
  end
end