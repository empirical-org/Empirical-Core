class Types::QuestionType < Types::BaseObject
  description "A question that belongs to a set that belongs to an activity."

  field :id, ID, null: false
  field :activity_id, Integer, null: false
  field :order, Integer, null: false
  field :prompt, String, null: false

  field :responses, [Types::ResponseType, null: true], null: false

  def responses
    object.responses
  end
end