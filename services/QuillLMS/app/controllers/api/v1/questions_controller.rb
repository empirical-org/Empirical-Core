class Api::V1::QuestionsController < Api::ApiController
  before_filter :get_question_by_uid, except: [:index, :create, :valid_params]

  ALL_QUESTIONS_CACHE_KEY = 'ALL_QUESTIONS'
  ALL_QUESTIONS_CACHE_EXPIRY = 600

  def index
    all_questions = $redis.get(ALL_QUESTIONS_CACHE_KEY)
    if !all_questions
      all_questions = Question.all.reduce({}) { |agg, q| agg.update({q.uid => q.as_json}) }
      $redis.set(ALL_QUESTIONS_CACHE_KEY, all_questions, {ex: ALL_QUESTIONS_CACHE_EXPIRY})
    end
    render(json: all_questions.as_json)
  end

  def show
    render_question
  end

  def create
    uid = SecureRandom.uuid
    @question = Question.create!(uid: uid, data: valid_params)
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
end
