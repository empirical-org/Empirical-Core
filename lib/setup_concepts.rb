require "net/http"
require "uri"
require "json"

module Setup
  class Concepts
    class_attribute :concepts

    def initialize
      self.concepts = []
    end

    def fetch_concepts
      uri = URI.parse("https://staging.quill.org/api/v1/concepts")
      response = Net::HTTP.get_response(uri)
      self.concepts = self.string_to_json(response.body)["concepts"]
      return response
    end

    def find_parent_concept_from_concepts(child)
      concepts.select{|con| con["id"] == child["parent_id"]}.first
    end

    def find_or_create_parent_in_db(child)
      found_parent = self.find_parent_concept_from_concepts(child)
      parent = Concept.find_by_name(found_parent["name"])
      if parent.nil?
        parent = create_concept(found_parent)
      end
      return parent
    end

    def create_concept(concept)
      con = Concept.new(name: concept["name"], uid: concept["uid"])
      if concept["parent_id"]
        parent = self.find_or_create_parent_in_db(concept) 
        con.parent_id = parent.id
      end
      con.save
      return con
    end

    def create_all
      self.concepts.each do |con|
        self.create_concept(con)
      end
    end

    def string_to_json(response_string)
      JSON.parse(response_string)
    end

    def run
      self.fetch_concepts
      self.create_all
    end
  end
end 