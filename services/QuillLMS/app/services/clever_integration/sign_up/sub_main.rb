# frozen_string_literal: true

module CleverIntegration::SignUp::SubMain

  # we have to send district_success, district_failure, user_success, user_failure back to controller

  def self.run(auth_hash)
    case auth_hash[:info][:user_type]
    when 'district_admin'
      district(auth_hash)
    when 'student'
      student(auth_hash)
    when 'school_admin'
      school_admin(auth_hash)
    else
      teacher(auth_hash)
    end
  end

  def self.district(auth_hash)
    CleverIntegration::SignUp::CleverDistrict.run(auth_hash)
  end

  def self.teacher(auth_hash)
    CleverIntegration::TeacherIntegration.run(auth_hash)
  end

  def self.student(auth_hash)
    CleverIntegration::SignUp::Student.run(auth_hash)
  end

  def self.school_admin(auth_hash)
    CleverIntegration::SignUp::SchoolAdmin.run(auth_hash)
  end

end
