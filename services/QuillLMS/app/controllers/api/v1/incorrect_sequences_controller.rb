# frozen_string_literal: true

class Api::V1::IncorrectSequencesController < Api::ApiController
  before_action :get_question_by_uid

  def index
    render_all_incorrect_sequences
  end

  def show
    render_incorrect_sequence(params[:id])
  end

  def create
    @question.add_incorrect_sequence(valid_params)
    render(json: {params[:id] => @question.get_incorrect_sequence(params[:id])})
  end

  def update
    return not_found unless @question.get_incorrect_sequence(params[:id])

    if @question.set_incorrect_sequence(params[:id], valid_params)
      render_incorrect_sequence(params[:id])
    else
      render json: @question.errors, status: 422
    end
  end

  def destroy
    @question.delete_incorrect_sequence(params[:id])
    render(plain: 'OK')
  end

  def update_all
    @question.update_incorrect_sequences(params_as_hash)
    render_all_incorrect_sequences
  end

  private def get_question_by_uid
    @question = Question.find_by!(uid: params[:question_id])
  end

  private def params_as_hash
    valid_params.is_a?(Array) ? valid_params.map {|x| x.to_h } : valid_params.to_h
  end

  private def valid_params
    filtered_params = params.require(:incorrect_sequence)
    filtered_params.is_a?(Array) ? filtered_params.map {|x| x.except(:uid).permit! } : filtered_params.except(:uid).permit!
  end

  private def get_question_by_uid
    @question = Question.find_by!(uid: params[:question_id])
  end

  private def render_incorrect_sequence(incorrect_sequence_id)
    incorrect_sequence = @question.get_incorrect_sequence(incorrect_sequence_id)
    return not_found unless incorrect_sequence

    render(json: incorrect_sequence)
  end

  private def render_all_incorrect_sequences
    render(json: @question.data["incorrectSequences"])
  end
end
