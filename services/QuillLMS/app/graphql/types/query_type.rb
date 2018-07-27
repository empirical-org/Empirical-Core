class Types::QueryType < Types::BaseObject

  field :current_user, Types::UserType, null: true do
     resolve -> (obj, args, ctx) { ctx[:current_user] }
  end

  field :concepts, [Types::ConceptType], null: false do
    argument :parent_id, String, null: true
    resolve -> (obj, args, ctx) { args.any? ? Concept.where(args) : Concept.all}
  end
end
