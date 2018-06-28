class Types::QueryType < Types::BaseObject

  field :current_user, Types::UserType, null: true, resolve: -> (obj, args, ctx) { ctx[:current_user] }
end
