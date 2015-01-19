class ConceptTag < ActiveRecord::Base
  belongs_to :concept_tag_category
  has_many :concept_tag_results
end