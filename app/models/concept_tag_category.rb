class ConceptTagCategory < ActiveRecord::Base
  has_many :concept_tags
  has_many :concept_tag_results, through: :concept_tags
end