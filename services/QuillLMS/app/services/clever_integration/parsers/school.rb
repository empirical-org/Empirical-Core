module CleverIntegration::Parsers::School

  def self.run(response)
    {
      nces_id: response.data.nces_id,
      id: response.data.id
    }
  end

end
