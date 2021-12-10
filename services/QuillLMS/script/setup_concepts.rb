# frozen_string_literal: true

require "net/http"
require "uri"

concepts_from_api = []

def fetch_concepts
  uri = URI.parse("http://google.com/")

  # Shortcut
  response = Net::HTTP.get_response(uri)
  4
end

concepts_from_api.each do |con|
  Concept.create(con)
end

