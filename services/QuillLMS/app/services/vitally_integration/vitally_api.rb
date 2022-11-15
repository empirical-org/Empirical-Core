# frozen_string_literal: true

class VitallyApi
  BASE_URL = 'https://api.vitally.io/analytics/v1'
  RATE_LIMIT_CODE = 429
  ENDPOINT_BATCH = 'batch'
  ENDPOINT_UNLINK = 'unlink'
  API_KEY = ENV['VITALLY_API_KEY']


  class RateLimitError < StandardError; end
  class ApiError < StandardError; end

  def batch(payload)
    call(ENDPOINT_BATCH, payload)
  end

  def unlink(payload)
    call(ENDPOINT_UNLINK, payload)
  end

  private def call(endpoint, payload)
    response = HTTParty.post("#{BASE_URL}/#{endpoint}",
      headers: {
        Authorization: "Basic #{API_KEY}",
        "Content-Type": "application/json"
      },
      body: payload.to_json
    )

    return response if response.success?

    raise RateLimitError if response.code == RATE_LIMIT_CODE
    raise ApiError, response.code.to_s
  end
end
