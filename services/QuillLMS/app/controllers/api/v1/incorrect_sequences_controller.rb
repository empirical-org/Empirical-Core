class Api::V1::IncorrectSequencesController < Api::ApiController
  before_filter :get_question_by_uid

  def index
    render_all_incorrect_sequences
  end

  def show
    render_incorrect_sequence(params[:id])
  end

  def create
    @question.add_incorrect_sequence(valid_params)
    render(json: {params[:id] => @question.data.dig("incorrectSequences", params[:id])})
  end

  def update
    return not_found unless @question.data.dig("incorrectSequences", params[:id])
    @question.set_incorrect_sequence(params[:id], valid_params)
    render_incorrect_sequence(params[:id])
  end

  def update_all
    @question.update_incorrect_sequences(valid_params)
    render_all_incorrect_sequences
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

  private def render_incorrect_sequence(incorrect_sequence_id)
    incorrect_sequence = @question.data.dig("incorrectSequences", incorrect_sequence_id)
    return not_found unless incorrect_sequence
    render(json: incorrect_sequence)
  end

  private def render_all_incorrect_sequences
    render(json: @question.data["incorrectSequences"])
  end
end
