class Types::QuestionSetType < Types::BaseObject

  field :id, ID, null: false
  field :activity_id, Integer, null: false
  field :order, Integer, null: false
  field :prompt, String, null: false

  field :questions, [Types::QuestionType, null: true], null: false

  def questions
    object.questions
  end
end