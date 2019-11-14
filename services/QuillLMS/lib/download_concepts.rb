module Setup
  class DownloadConcepts
    class_attribute :concepts

    def initialize
      self.concepts = []
    end

    def fetch_concepts
      uri = URI.parse("https://staging.quill.org/api/v1/concepts")
      response = Net::HTTP.get_response(uri)
      self.concepts = string_to_json(response.body)["concepts"]
      response
    end

    def string_to_json(response_string)
      JSON.parse(response_string)
    end
  end
end