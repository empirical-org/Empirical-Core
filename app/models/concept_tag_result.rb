class ConceptTagResult < ActiveRecord::Base

  belongs_to :concept_tag

  before_create :extract_tag_from_metadata

  # validates :concept_tag, presence: true

  private

  def extract_tag_from_metadata
    tag_name = metadata.delete("concept_tag") # Can't use symbols because it's a JSON hash
    tag_category_name = metadata.delete("concept_tag_category")
    self.concept_tag = ConceptTag.joins(:concept_tag_category)
      .where(name: tag_name, concept_tag_categories: {name: tag_category_name})
      .first
  end
end