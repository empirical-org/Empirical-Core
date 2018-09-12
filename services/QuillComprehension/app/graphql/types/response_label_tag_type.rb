class Types::ResponseLabelTagType < Types::BaseObject
  description 'A tag for a response label'

  field :response_label_id, ID, null: true
  field :response_id, ID, null: true
  field :score, Integer, null: true
end