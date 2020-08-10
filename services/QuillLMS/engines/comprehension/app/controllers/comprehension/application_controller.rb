module Comprehension
  class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception

    # This patch is to fix an issue with json rendering in the parent app
    # Calling "render json: @something.to_json" works (with .to_json),
    # but "render json: @something" does not work (without .to_json) it calls .to_json methods in the parent app's models)
    # this ensures that .to_json is always called, else tests will pass in the engine
    # but functionality will be broken in the main app.
    def render(options, *args)
      super(ensure_json_format_for(options), *args)
    end

    private def ensure_json_format_for(options)
      return options unless (json = options[:json]) # doesn't have json
      return options if json.is_a?(String) # json already formatted

      options.merge(json: json.to_json)
    end

  end
end
