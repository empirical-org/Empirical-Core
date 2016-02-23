module CleverIntegration::Sync::Main

  def self.run
    CleverIntegration::Sync::SubMain.run(requesters)
  end

  private

  def self.requesters
    {
      teacher_requester: CleverIntegration::Requester.teacher,
      section_requester: CleverIntegration::Requester.section,
      district_requester: CleverIntegration::Requester.district
    }
  end

end