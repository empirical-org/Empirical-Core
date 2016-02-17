module CleverIntegration::Main

  def self.run(auth_hash)
    if auth_hash[:info][:user_type] == "district"
      result = self.distric_sign_up(auth_hash)
    else
      result = self.user_sign_up(auth_hash)
    end
    result
  end

  private

  def self.distric_sign_up(auth_hash)
    result = CleverIntegration::DistrictSignUp::Main.run(auth_hash)
    result
  end

  def self.user_sign_up(auth_hash)
    result = CleverIntegration::UserSignUp::Main.run(auth_hash)
    result
  end
end