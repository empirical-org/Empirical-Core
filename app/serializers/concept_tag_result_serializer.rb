class ConceptTagResultSerializer < ActiveModel::Serializer
  attributes :concept_tag

  def concept_tag
    object.concept_tag.name if object.concept_tag.present?
  end

  def attributes
    data = super
    data.merge!(object.metadata)
    data
  end
end