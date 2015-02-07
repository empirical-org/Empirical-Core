class ConceptTag < ActiveRecord::Base
  belongs_to :concept_class
  has_many :concept_tag_results
end