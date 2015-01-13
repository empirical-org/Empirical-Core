class ConceptTagResult < ActiveRecord::Base

  belongs_to :concept_tag
  belongs_to :activity_session

  before_validation :extract_tag_from_metadata, on: :create

  validates :concept_tag, presence: true

  private

  def extract_tag_from_metadata
    return unless metadata.present?
    tag_name = metadata.delete("concept_tag") # Can't use symbols because it's a JSON hash
    tag_category_name = metadata.delete("concept_tag_category")
    self.concept_tag = ConceptTag.joins(:concept_tag_category)
      .where(name: tag_name, concept_tag_categories: {name: tag_category_name})
      .first
  end
end