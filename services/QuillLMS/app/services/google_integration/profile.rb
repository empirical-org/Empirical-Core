module GoogleIntegration::Profile

  def self.fetch_name_email_and_google_id(access_token)
    data = self.fetch_data(access_token)
    name = data['displayName']
    email = data['emails'][0]['value']
    google_id = data['id']
    [name, email, google_id]
  end

  private

  def self.fetch_data(access_token)
    client = self.client(access_token)
    service = client.discovered_api('plus')
    result = client.execute(
      api_method: service.people.get,
      parameters: {'userId' => 'me'},
      headers: {'Content-Type' => 'application/json'})
    data = JSON.parse(result.body)
    data
  end

  def self.client(access_token)
    GoogleIntegration::Client.create(access_token)
  end
end
