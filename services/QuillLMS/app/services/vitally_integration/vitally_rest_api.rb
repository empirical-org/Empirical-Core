# frozen_string_literal: true

class VitallyRestApi
  VITALLY_REST_API_BASE_URL = 'https://rest.vitally.io/resources'

  def initialize
    @api_key = ENV['VITALLY_REST_API_KEY']
  end

  def create(type, payload)
    post(type, payload)
  end

  def exists?(type, id)
    get(type, id).try(:error).blank?
  end

  def get(type, id)
    HTTParty.get("#{VITALLY_REST_API_BASE_URL}/#{type}/#{id}",
      headers: {
        Authorization: "Basic #{@api_key}",
        "Content-Type": "application/json"
      }
    )
  end

  def update(type, id, payload)
    HTTParty.put("#{VITALLY_REST_API_BASE_URL}/#{type}/#{id}",
      headers: {
        Authorization: "Basic #{@api_key}",
        "Content-Type": "application/json"
      },
      body: payload.to_json
    )
  end

  private def post(type, payload)
    HTTParty.post("#{VITALLY_REST_API_BASE_URL}/#{type}",
      headers: {
        Authorization: "Basic #{@api_key}",
        "Content-Type": "application/json"
      },
      body: payload.to_json
    )
  end
end
