class Api::V1::QuestionsController < Api::ApiController
  before_action :get_question_type, only: [:index, :create]
  before_action :get_question_by_uid, except: [:index, :create, :show]

  ALL_QUESTIONS_CACHE_KEY = 'ALL_QUESTIONS'
  ALL_QUESTIONS_CACHE_EXPIRY = 600
  QUESTION_CACHE_KEY_PREFIX = 'QUESTION'
  QUESTION_CACHE_KEY_EXPIRY = 600

  def index
    cache_key = ALL_QUESTIONS_CACHE_KEY + "_#{@question_type}"
    all_questions = $redis.get(cache_key)

    if !all_questions
      all_questions = Question.where(question_type: @question_type.to_s).reduce({}) { |agg, q| agg.update({q.uid => q.as_json}) }
      $redis.set(cache_key, all_questions.to_json, {ex: ALL_QUESTIONS_CACHE_EXPIRY})
    end
    render(json: all_questions)
  end

  def show
    @question = $redis.get(get_question_cache_key(params[:id])
    if !@question
      @question = Question.find_by!(uid: params[:id])
      $redis.set(get_question_cache_key(@question.uid, @question, {ex: QUESTION_CACHE_KEY_EXPIRY})
    end
    render_question
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
    return "#{QUESTION_CACHE_KEY_PREFIX}_#{uid}"
  end
end
