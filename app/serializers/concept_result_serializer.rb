class ConceptResultSerializer < ActiveModel::Serializer
  attributes :concept_name, :metadata

  def concept_name
    object.concept.name
  end
end