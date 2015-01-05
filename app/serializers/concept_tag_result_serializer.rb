class ConceptTagResultSerializer < ActiveModel::Serializer
  attributes :concept_tag

  def concept_tag
    object.concept_tag.name
  end

  def attributes
    data = super
    data.merge!(object.metadata)
    data
  end
end