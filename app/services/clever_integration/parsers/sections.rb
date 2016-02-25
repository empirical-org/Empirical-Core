module CleverIntegration::Parsers::Sections

  def self.run(sections_response)
    parsed_data = sections_response.map do |section_response|
      {
        clever_id: section_response[:id],
        name: section_response[:name],
        grade: section_response[:grade]
      }
    end
    parsed_data
  end
end