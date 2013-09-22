class Chapter::PracticeController < Chapter::BaseController
  before_filter :find_rule, except: ['verify', 'verify_status']
  before_filter :update_progress, except: ['verify', 'verify_status']
  prepend_before_filter :clean_step_param

  def show
    if params[:question_index].blank?
      params[:"#{params[:step]}_id"] = params.delete(:id)
      params[:question_index] = 1
      redirect_to url_for(params.merge(id: nil))
      return
    end

    @score.practice! if @score.unstarted?
  end

  def index
    if skipping_practice?
      redirect_to chapter_story_path(@chapter)
    else
      redirect_to send("chapter_#{params[:step]}_path", @chapter, @chapter_test.step(params[:step].to_sym).rules.first.id)
    end
  end

  def verify
    @score = Score.find(params[:score_id])
    update_score
    input = @score.inputs.where(step: params[:step], rule_question_id: params[:lesson_input].first.first).first
    render json: input.as_json(methods: [:first_grade, :second_grade])
  end

  def verify_status
    @score = Score.find(params[:score_id])
    input = @score.inputs.where(step: params[:step], rule_question_id: params[:lesson_input].first.first).first
    render json: input.as_json(methods: [:first_grade, :second_grade])
  end

protected

  def find_rule
    return true if (params[:id] || params[:"#{params[:step]}_id"]).blank?
    @rule = Rule.find(params[:id] || params[:"#{params[:step]}_id"])
    @question = @rule.questions.unanswered(@score).sample
    raise 'help computer' if @question.blank?
    # too unpredictable.. please go where you need to will not infer
    # redirect_to @chapter_test.next_rule_url if @question.blank?
  end

  def clean_step_param
    unless %w(practice review).include? params[:step]
      raise 'invalid step'
    end
  end

private

  def update_score
    @score.update_attributes! lesson_input_key => params[:lesson_input]
  end

  def skipping_practice?
    @chapter.practice_rules.empty? && params[:step] == "practice"
  end

  def lesson_input_key
    :"#{params[:step]}_lesson_input"
  end

  def update_progress
    return unless @rule.present?
    @questions_completed = @chapter_test.current_step.rules.map(&:rule).index(@rule) * ChapterTest::MAX_QUESTIONS + params[:question_index].to_i
    @questions_total     = @chapter_test.current_step.rules.count * ChapterTest::MAX_QUESTIONS
  end
end
