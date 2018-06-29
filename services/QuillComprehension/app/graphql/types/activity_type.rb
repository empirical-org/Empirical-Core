class Types::ActivityType < Types::BaseObject

  field :id, ID, null: false
  field :title, String, null: false
  field :article, String, null: false
  field :description, String, null: false

  field :question_sets, [Types::QuestionSetType, null: true], null: false

  def question_sets
    object.question_sets
  end

  field :questions, [Types::QuestionType, null: true], null: false

  def questions
    object.questions
  end

  field :vocabulary_words, [Types::VocabularyWordType, null: true], null: false

  def vocabulary_words
    object.vocabulary_words
  end
end
