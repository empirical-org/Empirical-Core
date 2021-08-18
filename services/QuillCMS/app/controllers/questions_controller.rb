class QuestionsController < ApplicationController
  MULTIPLE_CHOICE_LIMIT = 2

  def responses
    render json: GradedResponse.no_parent.where(question_uid: params[:question_uid])
  end

  def multiple_choice_options
    optimal = GradedResponse
      .optimal
      .where(question_uid: params[:question_uid])
      .limit(MULTIPLE_CHOICE_LIMIT)
      .order('count DESC')
      .to_a

    nonoptimal_main = MultipleChoiceResponse
      .where(question_uid: params[:question_uid])
      .limit(MULTIPLE_CHOICE_LIMIT)
      .order('count DESC')
      .to_a

    nonoptimal = nonoptimal_main.concat(nonoptimal_fallback(nonoptimal_main.count))

    render json: optimal.concat(nonoptimal)
  end

  # The MultipleChoiceResponse model contains responses
  # that have a count > MultipleChoiceResponse::MIN_COUNT
  # All questions, like new ones, may not have enough responses,
  # so pull other nonoptimal responses as a fallback if needed
  private def nonoptimal_fallback(nonoptimal_count)
    return [] if nonoptimal_count >= MULTIPLE_CHOICE_LIMIT

    needed_count = MULTIPLE_CHOICE_LIMIT - nonoptimal_count

    # favor graded answers as fallbacks
    graded_nonoptimal = GradedResponse
      .graded_nonoptimal
      .where(question_uid: params[:question_uid])
      .where("count <= #{MultipleChoiceResponse::MIN_COUNT}")
      .limit(needed_count)
      .to_a

    return graded_nonoptimal if graded_nonoptimal.count == needed_count

    # otherwise pull any nonoptimal answer
    # ignore responses with count = 1 to avoid junk responses
    Response
      .nonoptimal
      .where(question_uid: params[:question_uid])
      .where("count > 1 AND count <= #{MultipleChoiceResponse::MIN_COUNT}")
      .limit(needed_count)
      .to_a
  end
end
