module CleverIntegration::SignUp::Main

  # we have to send district_success, district_failure, user_success, user_failure back to controller

  def self.run(auth_hash)
    # dependency injection so we dont have to make api requests in tests
    CleverIntegration::SignUp::SubMain.run(auth_hash, self.requesters)
  end

  private

  def self.requesters
    {
      teacher_requester: CleverIntegration::Requesters.teacher,
      section_requester: CleverIntegration::Requesters.section,
      school_admin_requester: CleverIntegration::Requesters.school_admin,
      school_requester: CleverIntegration::Requesters.school,
      sections_for_teacher_requester: CleverIntegration::Requesters.sections_for_teacher
    }
  end

end
