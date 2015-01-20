class ConceptClass < ActiveRecord::Base
  has_many :concept_tags
  has_many :concept_tag_results, through: :concept_tags

  def self.for_concept_tag_results(concept_tag_results)
    joins(:concept_tags => :concept_tag_results).where('concept_tag_results.id' => concept_tag_results).uniq
  end
end