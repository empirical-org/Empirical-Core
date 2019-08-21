class Feedback
  include HTTParty
  base_uri 'us-east1-comprehension-247816.cloudfunctions.net/response-api-alpha'
  format :json
  attr_reader :prompt_key, :entry

  def initialize(prompt_key:, entry:)
    @prompt_key = prompt_key
    @entry = entry
  end

  def response
    self.class.post('', query: {entry: entry})
  end
end
