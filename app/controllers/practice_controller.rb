class PracticeController < BaseChapterController
  before_filter :signed_in!
  before_filter :find_rule
  prepend_before_filter :clean_step_param

  def show
    if params[:question_index].blank?
      params[:"#{params[:step]}_id"] = params.delete(:id)
      params[:question_index] = 1
      redirect_to url_for(params.merge(id: nil))
      return
    end
  end

  def index
    raise 'naoesuahoeu'
    if skipping_practice?
      redirect_to chapter_story_path(@chapter)
    else
      redirect_to send("chapter_#{params[:step]}_path", @chapter, @chapter_test.step(params[:step].to_sym).rules.first.id)
    end
  end

  def update
    @score.update_attributes! lesson_input_key => params[:lesson_input]
    redirect_to @chapter_test.next_lesson_url
  end

protected

  def find_rule
    return true if (params[:id] || params[:"#{params[:step]}_id"]).blank?
    @rule = Rule.find(params[:id] || params[:"#{params[:step]}_id"])
    @question = @rule.questions.unanswered(@score).sample
    redirect_to @chapter_test.next_rule_url if @question.blank?
  end

  def clean_step_param
    unless %w(practice review).include? params[:step]
      raise 'invalid step'
    end
  end

private

  def skipping_practice?
    @chapter.practice_rules.empty? && params[:step] == "practice"
  end

  def lesson_input_key
    :"#{params[:step]}_lesson_input"
  end
end
