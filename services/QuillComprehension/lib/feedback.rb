class Feedback
  include HTTParty
  base_uri 'us-east1-comprehension-247816.cloudfunctions.net/response-api-alpha'
  format :json
  attr_reader :prompt_id, :entry

  def initialize(prompt_id:, entry:)
    @prompt_id = prompt_id
    @entry = entry
  end

  def response
    self.class.post('', query: {entry: entry, prompt_id: prompt_id})
  end
end
