class Types::QueryType < Types::BaseObject
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :activity, Types::ActivityType, description: 'Activity', null: true do
    argument :id, ID, required: false
  end

  def activity(**args)
    Activity.find(args[:id])
  end

  field :activities, [Types::ActivityType, null: true], description: 'Activities', null: false

  def activities
    Activity.all
  end

  field :questions, [Types::QuestionType, null: true], description: 'Questions', null: false

  def questions
    Question.all
  end

  field :question, Types::QuestionType, description: 'Questions', null: true do
    argument :id, ID, required: false
  end

  def question(**args)
    Question.find(args[:id])
  end

  field :responses, [Types::ResponseType, null: true], description: 'Responses to Questions', null: false

  def responses
    Response.all.limit(30)
  end

  field :response_labels, [Types::ResponseLabelType, null: true], description: 'Labels for Responses', null: false

  def response_labels
    ResponseLabel.all
  end

  field :response_label_tags, [Types::ResponseLabelTagType, null: true], description: 'Tags for Response Labels', null: false

  def response_label_tags
    ResponseLabelTag.all.limit(30)
  end
end
