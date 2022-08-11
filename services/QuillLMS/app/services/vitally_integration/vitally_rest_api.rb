# frozen_string_literal: true

class VitallyRestApi
  VITALLY_REST_API_BASE_URL = 'https://rest.vitally.io/resources'
  API_KEY = ENV['VITALLY_REST_API_KEY']

  def create(type, payload)
    HTTParty.post("#{VITALLY_REST_API_BASE_URL}/#{type}",
      headers: headers,
      body: payload.to_json
    )
  end

  def exists?(type, id)
    !get(type, id).parsed_response.key?('error')
  end

  def create_unless_exists(type, id, payload)
    return if exists?(type, id)

    create(type, payload)
  end

  def get(type, id)
    HTTParty.get("#{VITALLY_REST_API_BASE_URL}/#{type}/#{id}",
      headers: headers
    )
  end

  def update(type, id, payload)
    HTTParty.put("#{VITALLY_REST_API_BASE_URL}/#{type}/#{id}",
      headers: headers,
      body: payload.to_json
    )
  end

  private def headers
    {
      Authorization: "Basic #{API_KEY}",
      "Content-Type": "application/json"
    }
  end
end
