# frozen_string_literal: true

RSpec::ROUTING_URL_HELPERS = "routing url helpers"

RSpec.shared_context RSpec::ROUTING_URL_HELPERS do
  include Rails.application.routes.url_helpers

  def default_url_options
    { only_path: true }
  end
end