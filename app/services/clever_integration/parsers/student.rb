module CleverIntegration::Parsers::Student

  def self.run(hash)
    name_hash = hash[:name]
    name = self.generate_name(name_hash[:first], name_hash[:last])
    {
      clever_id: hash[:id],
      email: hash[:email].downcase,
      username: hash[:credentials][:district_username],
      name: name
    }
  end

  private

  def self.generate_name(first_name, last_name)
    NameUnifier.run(first_name, last_name)
  end
end