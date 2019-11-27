class Api::V1::QuestionsController < Api::ApiController
  before_action :get_question_type
  before_action :get_question_by_uid, except: [:index, :create, :valid_params]

  ALL_QUESTIONS_CACHE_KEY = 'ALL_QUESTIONS'
  ALL_QUESTIONS_CACHE_EXPIRY = 600

  def index
    all_questions = $redis.get(ALL_QUESTIONS_CACHE_KEY + "_#{@question_type.name}")
    if !all_questions
      all_questions = @question_type.questions.reduce({}) { |agg, q| agg.update({q.uid => q.as_json}) }
      $redis.set(ALL_QUESTIONS_CACHE_KEY + "_#{@question_type.name}", all_questions.to_json, {ex: ALL_QUESTIONS_CACHE_EXPIRY})
    end
    render(json: all_questions)
  end

  def show
    render_question
  end

  def create
    uid = SecureRandom.uuid
    @question = Question.create!(uid: uid, data: valid_params, question_type_id: @question_type.id)
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
    @question = Question.find_by!(uid: params[:id], question_type_id: @question_type.id)
  end

  private def valid_params
    params.require(:question).except(:uid)
  end

  private def render_question
    render(json: @question.as_json)
  end

  private def get_question_type
    @question_type = QuestionType.find_by(name: params[:question_type_id])
  end
end
