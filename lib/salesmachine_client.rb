class SalesmachineClient

  BATCH_ENDPOINT = '/v1/batch'

  def self.batch(data)
    new.batch(data)
  end

  def initialize(api_key = nil)
    @api_key = api_key || ENV['SALESMACHINE_API_KEY']
  end

  def client
    Faraday.new(url: 'https://api.salesmachine.io/')
  end

  def batch(data)
    handle_response { make_request(data) }
  end

  def make_request(data)
    client.post do |request|
      request.url(BATCH_ENDPOINT)
      request.headers['Authorization'] = auth_header_value
      request.headers['Content-Type'] = 'application/json'
      request.body = data.to_json
    end
  end

  def auth_header_value
    "Basic #{Base64.encode64(@api_key + ":")}"
  end

  def handle_response(&block)
    response = block.call

    if response.success?
      true
    else
      raise "#{response.status}"
    end
  end
end
