class Api::V1::IncorrectSequencesController < Api::ApiController
  wrap_parameters format: [:json]
  before_filter :get_question_by_uid

  def index
    render(json: @question.data["incorrectSequences"])
  end

  def show
    incorrect_sequence = @question.data["incorrectSequences"][params[:id]]
    return not_found unless incorrect_sequence
    render(json: incorrect_sequence)
  end

  def create
    @question.add_incorrect_sequence(valid_params)
    show
  end

  def update
    return not_found unless @question.data["incorrectSequences"][params[:id]]
    @question.set_incorrect_sequence(params[:id], valid_params)
    show
  end

  def update_all
    @question.update_incorrect_sequences(valid_params)
    show
  end

  private def get_question_by_uid
    @question = Question.find_by!(uid: params[:question_id])
  end

  private def valid_params
    params.require(:incorrect_sequence).except(:uid)
  end

  private def get_question_by_uid
    @question = Question.find_by!(uid: params[:question_id])
  end

  private def valid_params
    params.require(:incorrect_sequence).except(:uid)
  end
end
