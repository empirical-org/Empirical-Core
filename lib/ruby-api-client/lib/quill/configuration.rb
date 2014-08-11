module Quill

  class Configuration
    def initialize options = {}, defaults = {}
      options.assert_valid_keys(*@@keys)
      @config = {}

      @@keys.each do |key|
        @config[key] = options[key] || @@env["#{@@namespace.to_s.upcase}_#{key.to_s.upcase}"] || defaults[key]
      end
    end

    def method_missing method
      super unless @@keys.include? method
      @config[method]
    end

    class << self
      def keys *args
        @@keys = args
      end

      def namespace namespace
        @@namespace = namespace
      end

      def env env
        @@env = env
      end
    end
  end

end
