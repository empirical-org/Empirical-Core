module CleverIntegration::Creators::School

  def self.run(parsed_response)
    puts "Creating Clever School: #{parsed_response[:name]}"
    school = ::School.find_or_create_by(name: parsed_response[:name])
    school
  end

end
