module CleverIntegration::Parsers::Teacher

  def self.run(hash)
    begin
      name = self.generate_name(hash[:name][:first], hash[:name][:last])
      {
        clever_id: hash[:id],
        email: hash[:email].downcase,
        name: name,
        district_id: hash[:district]
      }
    rescue NoMethodError => e
      NewRelic::Agent.add_custom_attributes({
        user_info: hash
      })
      NewRelic::Agent.notice_error(e)
    end
  end

  private

  def self.generate_name(first_name, last_name)
    JoinNames.new(first_name, last_name).call
  end
end
