Types::VocabularyWordType = GraphQL::ObjectType.define do
  name 'VocabularyWord'

  field :id, !types.ID
  field :text, !types.String
  field :description, !types.String
  field :example, !types.String
  field :order, !types.Int

end
