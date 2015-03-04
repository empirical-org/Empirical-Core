class ConceptTagResult < ActiveRecord::Base

  belongs_to :concept_tag
  belongs_to :activity_session
  belongs_to :concept_category

  before_validation :extract_tag_from_metadata, on: :create

  validates :concept_tag, presence: true
  validates :concept_category, presence: true

  private

  def extract_tag_from_metadata
    return unless metadata.present?
    tag_name = metadata.delete("concept_tag") # Can't use symbols because it's a JSON hash
    if tag_name.present?
      concept_class_name = metadata.delete("concept_class")
      concept_category_name = metadata.delete("concept_category")
      self.concept_category = ConceptCategory.joins(:concept_class)
        .where(name: concept_category_name, concept_classes: {name: concept_class_name})
        .first
      self.concept_tag = ConceptTag.joins(:concept_class)
        .where(name: tag_name, concept_classes: {name: concept_class_name})
        .first
    end
  end
end