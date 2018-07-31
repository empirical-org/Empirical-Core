class Types::ConceptType < Types::BaseObject
  graphql_name 'Concept'

  field :id, ID, null: false
  field :uid, String, null: false
  field :name, String, null: false
  field :parent_id, ID, null: true
  
  field :parent, Types::ConceptType, null: true
  field :children, [Types::ConceptType, null: true], null: true
  field :siblings, [Types::ConceptType, null: true], null: true
  
  def parent
    Concept.find(object['parent_id']) if object['parent_id']
  end

  def children
    Concept.where(parent_id: object['id'])
  end

  def siblings
    Concept.where(parent_id: object['parent_id']).where.not(id: object['id'])
  end

end