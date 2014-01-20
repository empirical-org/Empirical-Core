class Quill::API
  class InvalidKeys < Exception ; end
  delegate :get, :post, :put, to: :connection

  def initialize
    self.class.endpoints.each do |endpoint, endpoint_definition|
      self.class.send(:define_method, endpoint) do
        Endpoint.new(self, endpoint, endpoint_definition)
      end
    end
  end

  def self.endpoints
    definition['root']
  end

  def self.definition
    YAML.load(File.read(File.expand_path('../api.yml', __FILE__)))
  end

  def connection
    Faraday.new(url: 'http://api.lvh.me:3002') do |conn|
      conn.request :json
      conn.response :json
      conn.adapter Faraday.default_adapter
    end
  end

  class Endpoint
    attr_accessor :name, :api

    def initialize api, name, definition
      @api = api
      @name = name
      @attributes = definition['attributes'].keys
    end

    def find id, params = {}
      check_keys(params)
      response = api.get([name,id].join('/'), params)
      Hashie::Mash.new(response.body['object'])
    end

    def create params
      check_keys(params)
      response = api.post(name, params)
      Hashie::Mash.new(response.body['object'])
    end

    def update id, params
      check_keys(params)
      response = api.put([name,id].join('/'), params)
      Hashie::Mash.new(response.body['object'])
    end

    def list
    end

    def check_keys params
      invalid_keys = params.stringify_keys.keys - @attributes
      raise InvalidKeys, "Endpoint ##{name} does not support key(s) #{invalid_keys.join(', ')}" unless invalid_keys.empty?
    end
  end
end
