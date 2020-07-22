class VitallyApi
  def initialize
    @api_key = ENV['VITALLY_API_KEY']
  end

  def batch(payload)
    send('https://api.vitally.io/analytics/v1/batch', payload)
  end

  private def send(url, payload)
    HTTParty.post(url,
      headers: {
        Authorization: "Basic #{@api_key}",
        "Content-Type": "application/json"
      },
      body: payload
    )
  end
end
