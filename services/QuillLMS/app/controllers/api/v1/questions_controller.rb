class Api::V1::QuestionsController < Api::ApiController
  wrap_parameters format: [:json]
  before_filter :get_question_by_uid, except: [:index, :create, :valid_params]

  def index
    all_questions = Question.all.reduce({}) { |agg, q| agg.update({q.uid => q.as_json}) }
    render(json: all_questions)
  end

  def show
    render(json: @question.as_json)
  end

  def create
    uid = params[:uid] ||= SecureRandom.uuid
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
    show
  end

  def update_model_concept
    @question.update_model_concept(valid_params[:modelConcept])
    show
  end

  private def get_question_by_uid
    @question = Question.find_by!(uid: params[:id])
  end

  private def valid_params
    params.require(:question).except(:uid)
  end
end
