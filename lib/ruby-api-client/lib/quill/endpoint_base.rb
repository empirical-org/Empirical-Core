module Quill
  module Endpoint
    class Base
      attr_accessor :name, :api
      class InvalidKeys < Exception ; end

      def initialize api, name, definition
        @api = api
        @name = name
        @attributes = definition['attributes'].keys
        @readonly_attributes = definition['readonly_attributes'].try(:keys) || []
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
        invalid_keys = params.stringify_keys.keys - @attributes - @readonly_attributes
        raise InvalidKeys, "Endpoint ##{name} does not support key(s) #{invalid_keys.join(', ')}" unless invalid_keys.empty?
      end
    end
  end
end
