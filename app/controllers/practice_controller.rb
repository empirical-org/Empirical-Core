class PracticeController < BaseChapterController
  before_filter :signed_in!

  def show
    @rule = Rule.find(params[:id])
    @next_path = chapter_test_practice_path(@chapter, @chapter.practice_rules.first, step: params[:step])
  end

  def index
    if @chapter.practice_rules.empty? && params[:step] == "practice"
      redirect_to chapter_test_story_path(@chapter)
      return
    end

    redirect_to chapter_test_practice_path(@chapter, @chapter_test.step(params[:step].to_sym).rules.first.id, step: params[:step])
  end

  def update

    @rule = Rule.find(params[:id])
    @score.update_attributes! lesson_input => merged_lesson_input
    redirect_to next_lesson
  end

  protected

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

    if params[:step] == "practice"
      @score.practice_lesson_input.merge(params[:lesson_input])
    else
      @score.review_lesson_input.merge(params[:lesson_input])
    end
  end

  def next_id
    @chapter_test.step(params[:step].to_sym).next_rule.try(:id)
  end

  def next_lesson
    if next_id.present?
      chapter_test_practice_path @chapter, next_id, step: params[:step]
    else
      step_after_rules_completed
    end
  end

  def step_after_rules_completed
    if params[:step] == "practice"
      chapter_test_story_path(@chapter)
    else
      @score.finalize!
      final_chapter_test_path(@chapter)
    end
  end
end
