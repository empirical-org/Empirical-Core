module CleverIntegration::Creators::School

  def self.run(parsed_response)
    unless parsed_response[:nces_id].blank?
      school = ::School.find_by(nces_id: parsed_response[:nces_id])
      school
    end
  end

end
