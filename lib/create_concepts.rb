module Setup
  class CreateConcepts
    class_attribute :concepts

    def initialize(concepts)
      self.concepts = concepts
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
  end
end