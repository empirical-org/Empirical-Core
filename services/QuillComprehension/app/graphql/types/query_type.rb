Types::QueryType = GraphQL::ObjectType.define do
  name "Query"
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :activity, Types::ActivityType do
    description 'Activity'
    argument :id, types.ID
    resolve -> (obj, args, ctx) {
      Activity.find(args[:id])
    }
  end

  field :activities, !types[Types::ActivityType] do
    description 'Activities'
    resolve -> (obj, args, ctx) {
      Activity.all
    }
  end

  field :questions, !types[Types::QuestionType] do
    description 'Questions'
    resolve -> (obj, args, ctx) {
      Question.all
    }
  end

  field :question, Types::QuestionType do
    description 'Questions'
    argument :id, types.ID
    resolve -> (obj, args, ctx) {
      Question.find(args[:id])
    }
  end

  field :responses, !types[Types::ResponseType] do
    description 'Responses to Questions'
    resolve -> (obj, args, ctx) {
      Response.all.limit(30)
    }
  end

  field :response_labels, !types[Types::ResponseLabelType] do
    description 'Labels for Responses'
    resolve -> (obj, args, ctx) {
      ResponseLabel.all
    }
  end

  field :response_label_tags, !types[Types::ResponseLabelTagType] do
    description 'Tags for Response Labels'
    resolve -> (obj, args, ctx) {
      ResponseLabelTag.all.limit(30)
    }
  end
end
