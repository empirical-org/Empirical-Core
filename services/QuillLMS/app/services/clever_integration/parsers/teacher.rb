module CleverIntegration::Parsers::Teacher

  def self.run(hash)
    name = self.generate_name(hash[:name][:first], hash[:name][:last])
    {
      clever_id: hash[:id],
      email: hash[:email].downcase,
      name: name,
      district_id: hash[:district]
    }
  end

  private

  def self.generate_name(first_name, last_name)
    NameUnifier.run(first_name, last_name)
  end
end