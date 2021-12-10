# frozen_string_literal: true

module CleverIntegration::Parsers::Sections

  def self.run(sections_response)
    parsed_data = sections_response.map do |section_response|
      {
        clever_id: section_response.data.id,
        name: section_response.data.name,
        grade: section_response.data.grade
      }
    end
    parsed_data
  end
end
