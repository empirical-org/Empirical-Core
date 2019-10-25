class Api::V1::QuestionsController < Api::ApiController
  wrap_parameters format: [:json]
  before_filter :get_question_by_uid, except: [:index, :create, :valid_params]

  def index
    all_questions = Question.all.reduce({}) { |agg, q| agg.update({q.uid => q.as_json}) }
    render(json: all_questions || [])
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

  def create_focus_point
    @question.add_focus_point(valid_params)
    @question.save
    show
  end

  def update_focus_point
    return not_found unless @question.data["focusPoints"][params[:fp_id]]
    @question.set_focus_point(params[:fp_id], valid_params)
    @question.save
    show
  end

  def update_all_focus_points
    @question.update_focus_points(valid_params)
    @question.save
    show
  end

  def destroy_focus_point
    @question.delete_focus_point(params[:fp_id])
    @question.save
    show
  end

  def update_flag
    @question.update_flag(valid_params[:flag])
    @question.save
    show
  end

  def update_model_concept_uid
    @question.update_model_concept(valid_params[:modelConcept])
    @question.save
    show
  end

  def create_incorrect_sequence
    @question.add_incorrect_sequence(valid_params)
    @question.save
    show
  end

  def update_incorrect_sequence
    return not_found unless @question.data["incorrectSequences"][params[:is_id]]
    @question.set_incorrect_sequence(params[:is_id], valid_params)
    @question.save
    show
  end

  def update_all_incorrect_sequences
    @question.update_incorrect_sequences(valid_params)
    @question.save
    show
  end

  private def get_question_by_uid
    @question = Question.find_by!(uid: params[:id])
  end

  private def valid_params
    params.require(:question).except(:uid)
  end
end
