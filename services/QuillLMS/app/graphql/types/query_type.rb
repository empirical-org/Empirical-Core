class Types::QueryType < Types::BaseObject

  field :current_user, Types::UserType, null: true, resolve: -> (obj, args, ctx) { ctx[:current_user] }

  field :concept, Types::ConceptType, null: true do
    argument :id, Int, "Restrict items to this status", required: false
  end

  def concept(id: nil) 
    return Concept.find(id) if id
  end  

  field :concepts, [Types::ConceptType], null: false, resolve: -> (obj, args, ctx) { Concept.all }
end
