# frozen_string_literal: true

class VitallyApi
  VITALLY_API_BASE_URL = 'https://api.vitally.io/analytics/v1'

  def initialize
    @api_key = ENV['VITALLY_API_KEY']
  end

  def batch(payload)
    send('batch', payload)
  end

  def unlink(payload)
    send('unlink', payload)
  end

  private def send(command, payload)
    HTTParty.post("#{VITALLY_API_BASE_URL}/#{command}",
      headers: {
        Authorization: "Basic #{@api_key}",
        "Content-Type": "application/json"
      },
      body: payload.to_json
    )
  end
end
