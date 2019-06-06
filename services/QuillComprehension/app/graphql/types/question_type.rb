class Types::QuestionType < Types::BaseObject
  description "A question that belongs to a set that belongs to an activity."

  field :id, ID, null: false
  field :activity_id, Integer, null: false
  field :order, Integer, null: true
  field :prompt, String, null: false
  field :instructions, String, null: true

  field :responses, [Types::ResponseType, null: true], null: false

  def responses
    object.responses
  end
end
