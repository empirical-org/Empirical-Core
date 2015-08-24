require 'google/api_client'

class GoogleAuthenticate

  def initialize(auth)
    @access_token  = auth['token'],
    @refresh_token = auth['refresh_token'],
    @expires_at    = Time.at(auth['expires_at']).to_datetime)
  end

  def find_or_create_user
    user = User.find_or_initialize_by email: email, name: name
    if user.new_record?
      user.google_sign_in = true # so that password is not required in validations
      user.save
    end
    user
  end


  private

  def name
    @data ||= fetch_data
    name = @data['displayName']
  end

  def email
    @data ||= fetch_data
    email = @data['emails'][0]['value']
  end

  def fetch_data
    client = Google::APIClient.new
    client.authorization.access_token = fresh_token
    service = client.discovered_api('plus')
    result = client.execute(
      :api_method => service.people.get,
      :parameters => {'userId' => 'me'},
      :headers => {'Content-Type' => 'application/json'})
    data = JSON.parse(result.body)
  end

  def to_params
    {'refresh_token' => @refresh_token,
    'client_id' => ENV['CLIENT_ID'],
    'client_secret' => ENV['CLIENT_SECRET'],
    'grant_type' => 'refresh_token'}
  end

  def request_token_from_google
    url = URI("https://accounts.google.com/o/oauth2/token")
    Net::HTTP.post_form(url, self.to_params)
  end

  def refresh!
    response = request_token_from_google
    data = JSON.parse(response.body)
    @access_token = data['access_token']
    @expires_at = Time.now + (data['expires_in'].to_i).seconds)
  end

  def expired?
    @expires_at < Time.now
  end

  def fresh_token
    refresh! if expired?
    @access_token
  end
end
