class Types::MetricsType < Types::BaseObject
  field :correct, Integer, null: true
  field :logical, Integer, null: true
  field :well_structured, Integer, null: true
  field :grammatical, Integer, null: true
  field :detailed, Integer, null: true
  field :full_sentence, Integer, null: true
  field :relevant, Integer, null: true

end