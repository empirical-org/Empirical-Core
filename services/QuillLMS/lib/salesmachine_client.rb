class SalesmachineClient

  BATCH_ENDPOINT = '/v1/batch'
  EVENT_ENDPOINT = '/v1/track/event'
  TOO_MANY_REQUESTS = 429
  MAX_RETRIES = 10

  def self.batch(data)
    new.batch(data)
  end

  def self.event(data)
    new.event(data)
  end

  def initialize(api_key = nil)
    @api_key = api_key || ENV['SALESMACHINE_API_KEY']
  end

  def client
    Faraday.new(url: 'https://api.salesmachine.io/')
  end

  def batch(data)
    make_request(BATCH_ENDPOINT, data)
  end

  def event(data)
    make_request(EVENT_ENDPOINT, data)
  end

  def make_request(path, data)
    retries = MAX_RETRIES
    delay = 1

    begin
      client.post do |request|
        request.url(path)
        request.headers['Authorization'] = auth_header_value
        request.headers['Content-Type'] = 'application/json'
        request.body = data.to_json
      end
    rescue Faraday::ClientError => err
      raise if err.response[:status] != TOO_MANY_REQUESTS
      raise SalesmachineRetryError
      end
    end
  end

  def auth_header_value
    "Basic #{Base64.encode64(@api_key + ':')}"
  end
end
