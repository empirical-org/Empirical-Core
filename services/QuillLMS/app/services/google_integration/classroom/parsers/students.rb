# frozen_string_literal: true

module GoogleIntegration::Classroom::Parsers::Students
  def self.run(students)
    return [] if students.blank?

    students.pluck('profile').map do |profile_data|
      {
        name: profile_data.dig('name', 'fullName'),
        first_name: profile_data.dig('name', 'givenName'),
        last_name: profile_data.dig('name', 'familyName'),
        email: profile_data['emailAddress'],
        user_external_id: profile_data['id']
      }
    end
  end
end
