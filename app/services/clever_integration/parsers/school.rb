module CleverIntegration::Parsers::School

 def self.run(response)
    {
      name: response[:name]
    }
  end

end