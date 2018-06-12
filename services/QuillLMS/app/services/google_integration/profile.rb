class GoogleIntegration::Profile

  def initialize(access_token)
    @access_token = access_token
  end

  def name
    profile['displayName']
  end

  def email
    profile['emails'][0]['value']
  end

  def google_id
    profile['id']
  end

  private

  def profile
    @profile ||= begin
      response = fetch_profile
      JSON.parse(response.body)
    end
  end

  def fetch_profile
    service = client.discovered_api('plus')
    client.execute(
      api_method: service.people.get,
      parameters: { 'userId' => 'me' },
      headers:    { 'Content-Type' => 'application/json' }
    )
  end

  def client
    @client ||= GoogleIntegration::Client.new(@access_token).create
  end
end
