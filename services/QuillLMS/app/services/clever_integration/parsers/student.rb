module CleverIntegration::Parsers::Student

  def self.run(hash)
    name_hash = hash[:name]
    name = self.generate_name(name_hash[:first], name_hash[:last])
    username = hash[:credentials] ? hash[:credentials][:district_username] : nil
    {
      clever_id: hash[:id],
      email: hash[:email].try(:downcase),
      username: username,
      name: name
    }
  end

  private

  def self.generate_name(first_name, last_name)
    JoinNames.new(first_name, last_name).call
  end
end
