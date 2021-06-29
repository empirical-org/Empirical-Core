class Api::V1::FocusPointsController < Api::ApiController
  before_action :get_question_by_uid

  def index
    render_all_focus_points
  end

  def show
    render_focus_point
  end

  def create
    uid = @question.add_focus_point(valid_params)
    render(json: {uid => @question.data.dig("focusPoints", uid)})
  end

  def update
    return not_found unless @question.data.dig("focusPoints", params[:id])
    if @question.set_focus_point(params[:id], valid_params)
      render_focus_point
    else
      render json: @question.errors, status: 422
    end
  end

  def update_all
    @question.update_focus_points(params_as_hash)
    render_all_focus_points
  end

  def destroy
    @question.delete_focus_point(params[:id])
    render(plain: 'OK')
  end

  private def get_question_by_uid
    @question = Question.find_by!(uid: params[:question_id])
  end

  private def params_as_hash
    valid_params.is_a?(Array) ? valid_params.map {|x| x.to_h } : valid_params.to_h
  end

  private def valid_params
    filtered_params = params.require(:focus_point)
    filtered_params.is_a?(Array) ? filtered_params.map {|x| x.except(:uid).permit! } : filtered_params.except(:uid).permit!
  end

  private def render_focus_point
    focus_point = @question.data.dig("focusPoints", params[:id])
    return not_found unless focus_point
    render(json: focus_point)
  end

  private def render_all_focus_points
    render(json: @question.data["focusPoints"])
  end
end
