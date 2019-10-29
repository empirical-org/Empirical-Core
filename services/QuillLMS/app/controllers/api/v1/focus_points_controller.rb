class Api::V1::FocusPointsController < Api::ApiController
  wrap_parameters format: [:json]
  before_filter :get_question_by_uid

  def index
    render(json: @question.data["focusPoints"])
  end

  def show
    focus_point = @question.data["focusPoints"][params[:id]]
    return not_found unless focus_point
    render(json: focus_point)
  end

  def create
    @question.add_focus_point(valid_params)
    show
  end

  def update
    return not_found unless @question.data["focusPoints"][params[:id]]
    @question.set_focus_point(params[:id], valid_params)
    show
  end

  def update_all
    @question.update_focus_points(valid_params)
    show
  end

  def destroy
    @question.delete_focus_point(params[:id])
    show
  end

  private def get_question_by_uid
    @question = Question.find_by!(uid: params[:question_id])
  end

  private def valid_params
    params.require(:focus_point).except(:uid)
  end
end

