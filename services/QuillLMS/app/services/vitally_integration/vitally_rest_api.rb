# frozen_string_literal: true

class VitallyRestApi
  VITALLY_REST_API_BASE_URL = 'https://rest.vitally.io/resources'

  def initialize
    @api_key = ENV['VITALLY_REST_API_KEY']
  end

  def create(type, payload)
    send(type, payload)
  end

  private def send(type, payload)
    HTTParty.post("#{VITALLY_REST_API_BASE_URL}/#{type}",
      headers: {
        Authorization: "Basic #{@api_key}",
        "Content-Type": "application/json"
      },
      body: payload.to_json
    )
  end
end
