class PracticeController < BaseChapterController
  before_filter :signed_in!
  before_filter :find_rule

  def show
    if params[:question_index].blank?
      params[:practice_id] = params.delete(:id)
      params[:question_index] = 1
      redirect_to params
      return
    end
  end

  def index
    if skipping_practice?
      redirect_to chapter_story_path(@chapter)
    else
      redirect_to send("chapter_#{params[:step]}_path", @chapter, @chapter_test.step(params[:step].to_sym).rules.first.id)
    end
  end

  def update
    @score.update_attributes! lesson_input => merged_lesson_input
    redirect_to @chapter_test.next_lesson_url
  end

protected

  def find_rule
    return true if (params[:id] || params[:practice_id]).blank?
    @rule = Rule.find(params[:id] || params[:practice_id])
    @question = @rule.questions.unanswered(@score).sample
    redirect_to @chapter_test.next_rule_url if @question.blank?
  end

private

  def skipping_practice?
    @chapter.practice_rules.empty? && params[:step] == "practice"
  end

  def lesson_input
    if params[:step] == "practice"
      :practice_lesson_input
    else
      :review_lesson_input
    end
  end

  def merged_lesson_input
    if params[:lesson_input].blank?
      raise "lesson_input: #{params[:lesson_input]} user: #{current_user.id} params: #{params.inspect}"
    end

    lesson_input = :"#{params[:step]}_lesson_input"
    @score.send(lesson_input).merge(params[:lesson_input])
  end
end
