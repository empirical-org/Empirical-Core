class ConceptTagResult < ActiveRecord::Base

  belongs_to :concept_tag

  def concept_tag_name=(name)
    self.concept_tag = ConceptTag.find_by_name!(name)
  end
end