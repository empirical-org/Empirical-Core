# frozen_string_literal: true

class VitallyRestApi
  API_BASE_URL = 'https://rest.vitally.io/resources/'

  def initialize
    @api_key = ENV['VITALLY_REST_API_KEY']
  end

  def create_contact(payload)
    send('users', payload)
  end

  def create_account
  end

  def create_organization
  end

  def create_opportunity
  end

  private def send(command, payload)
    HTTParty.post("#{API_BASE_URL}/#{command}",
      headers: {
        Authorization: "Basic #{@api_key}",
        "Content-Type": "application/json"
      },
      body: payload.to_json
    )
  end
end
