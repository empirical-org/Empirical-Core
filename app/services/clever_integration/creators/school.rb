module CleverIntegration::Creators::School

  def self.run(parsed_response)
    school = ::School.find_by(nces_id: parsed_response[:nces_id])
    school
  end

end
