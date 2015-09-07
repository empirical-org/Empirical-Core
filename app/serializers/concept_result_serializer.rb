class ConceptResultSerializer < ActiveModel::Serializer
  attributes :concept, :metadata

  has_one :concept
end