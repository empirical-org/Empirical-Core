module CleverIntegration::Sync::Main

  def self.run
    CleverIntegration::Sync::SubMain.run(requesters)
  end

  private

  def self.requesters
    {
      teacher_requester: CleverIntegration::Requesters.teacher,
      section_requester: CleverIntegration::Requesters.section,
      school_admin_requester: CleverIntegration::Requesters.school_admin,
      district_requester: CleverIntegration::Requesters.district
    }
  end

end
