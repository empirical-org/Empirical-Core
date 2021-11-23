# frozen_string_literal: true

module CleverIntegration::SignUp::Main

  # we have to send district_success, district_failure, user_success, user_failure back to controller

  def self.run(auth_hash)
    # dependency injection so we dont have to make api requests in tests
    CleverIntegration::SignUp::SubMain.run(auth_hash)
  end

end
