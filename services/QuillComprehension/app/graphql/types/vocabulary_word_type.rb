class Types::VocabularyWordType < Types::BaseObject

  field :id, ID, null: false
  field :text, String, null: false
  field :description, String, null: false
  field :example, String, null: false
  field :order, Integer, null: false
end
