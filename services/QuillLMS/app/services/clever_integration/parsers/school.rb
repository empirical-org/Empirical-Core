module CleverIntegration::Parsers::School

 def self.run(response)
    {
      nces_id: response[:nces_id]
    }
  end

end
