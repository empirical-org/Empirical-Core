module CleverIntegration::Parsers::Teacher

  def self.run(auth_hash)
    info = auth_hash[:info]
    name = self.generate_name(info[:name][:first], info[:name][:last])
    {
      clever_id: info[:id],
      email: info[:email],
      name: name
    }
  end

  private

  def self.generate_name(first_name, last_name)
    NameUnifier.run(first_name, last_name)
  end
end