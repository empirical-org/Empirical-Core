module CleverIntegration::SignUp::SubMain

  # we have to send district_success, district_failure, user_success, user_failure back to controller

  def self.run(auth_hash, requesters)
    result = send(auth_hash[:info][:user_type],
                  auth_hash,
                  requesters)
    result
  end

  private

  def self.district(auth_hash, requesters)
    result = CleverIntegration::SignUp::CleverDistrict.run(auth_hash)
    result
  end

  def self.teacher(auth_hash, requesters)
    result = CleverIntegration::SignUp::Teacher.run(auth_hash, requesters)
    result
  end

  def self.student(auth_hash, requesters)
    result = CleverIntegration::SignUp::Student.run(auth_hash)
    result
  end
end
