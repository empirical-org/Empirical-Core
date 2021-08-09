class QuestionsController < ApplicationController
  MULTIPLE_CHOICE_LIMIT = 2

  def responses
    render json: GradedResponse.no_parent.where(question_uid: params[:question_uid])
  end

  def multiple_choice_options
    scope = GradedResponse.where(question_uid: params[:question_uid]).limit(MULTIPLE_CHOICE_LIMIT)

    optimal = scope.optimal
    nonoptimal = scope.nonoptimal.order('count DESC')

    render json: optimal.to_a.concat(nonoptimal.to_a)
  end
end
