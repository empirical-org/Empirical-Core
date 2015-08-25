require 'google/api_client'

class GoogleAuthenticate

  def initialize(auth)
    @access_token  = auth['token']
  end

  def find_or_create_user
    user = User.find_or_initialize_by email: email
    if user.new_record?
      user.google_sign_in = true # so that password is not required in validations
      user.name = name
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
    client = Google::APIClient.new(application_name: 'quill')
    client.authorization.access_token = @access_token
    service = client.discovered_api('plus')
    result = client.execute(
      :api_method => service.people.get,
      :parameters => {'userId' => 'me'},
      :headers => {'Content-Type' => 'application/json'})
    data = JSON.parse(result.body)
  end
end
