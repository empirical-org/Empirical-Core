module CleverIntegration::DistrictSignUp::Main

  def self.run(auth_hash)
    if auth_hash[:info][:id] && auth_hash[:credentials][:token]
      # This request is initiated automatically by Clever, not a user.
      # Import the schools and leave it at that.
      self.setup_district(auth_hash)
      result = {type: 'district_success', data: nil}
    else
      result = {type: 'district_failure', data: nil}
    end
    result
  end

  private

  def self.setup_district(auth_hash)
    CleverIntegration::District::Setup.run(auth_hash)
  end
end