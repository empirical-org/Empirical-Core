class EmpiricalGrammarSchema < GraphQL::Schema
  disable_introspection_entry_points unless Rails.env.development?

  mutation(Types::MutationType)
  query(Types::QueryType)
end
