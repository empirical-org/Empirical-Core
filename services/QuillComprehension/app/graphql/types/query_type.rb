Types::QueryType = GraphQL::ObjectType.define do
  name "Query"
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  # TODO: remove me
  field :activities, !types[Types::ActivityType] do
    description "An Activity"
    resolve ->(obj, args, ctx) {
      Activity.all
    }
  end
end
