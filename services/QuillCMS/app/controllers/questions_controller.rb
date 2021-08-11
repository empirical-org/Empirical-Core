class QuestionsController < ApplicationController
  MULTIPLE_CHOICE_LIMIT = 2

  def responses
    render json: GradedResponse.no_parent.where(question_uid: params[:question_uid])
  end

  def multiple_choice_options
    scope = GradedResponse
      .where(question_uid: params[:question_uid])
      .limit(MULTIPLE_CHOICE_LIMIT)
      .order('count DESC')

    render json: scope.optimal.to_a.concat(scope.nonoptimal.to_a)
  end
end
