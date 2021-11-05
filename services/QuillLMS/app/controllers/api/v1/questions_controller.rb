class Api::V1::QuestionsController < Api::ApiController
  before_action :get_question_type, only: [:index, :create]
  before_action :get_question_by_uid, except: [:index, :create, :show]

  def index
    render json: Question.all_questions_json_cached(@question_type)
  end

  def show
    render json: Question.question_json_cached(params[:id])
  end

  def create
    uid = SecureRandom.uuid
    @question = Question.create!(uid: uid, data: valid_params, question_type: @question_type)
    render(json: {@question.uid => @question.as_json})
  end

  def update
    @question.update!({data:valid_params})
    render(json: @question.as_json)
  end

  def destroy
    @question.destroy
    render(plain: 'OK')
  end

  def update_flag
    @question.update_flag(valid_params[:flag])
    render_question
  end

  def update_model_concept
    @question.update_model_concept(valid_params[:modelConcept])
    render_question
  end

  private def get_question_by_uid
    @question = Question.find_by!(uid: params[:id])
  end

  private def valid_params
    params.require(:question).except(:uid)
  end

  private def render_question
    render(json: @question.as_json)
  end

  private def get_question_type
    @question_type = params[:question_type]
  end

  private def get_question_cache_key(uid)
    "#{QUESTION_CACHE_KEY_PREFIX}_#{uid}"
  end
end
