module CleverIntegration::Creators::School

  def self.run(parsed_response)
    unless parsed_response[:nces_id].blank?
      school = ::School.find_by(nces_id: parsed_response[:nces_id])
      return school if school.present?
    end
    unless parsed_response[:id].blank?
      # Some schools (often charters) don't use NCES ID values for individual
      # schools, for those we manually establish the CleverID in our database
      # for their schools and use this lookup as a fallback
      school = ::School.find_by(clever_id: parsed_response[:id])
      return school if school.present?
    end
  end

end
