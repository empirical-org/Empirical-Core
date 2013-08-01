class PracticeController < BaseChapterController
  before_filter :signed_in!

  def show
    @rule = Rule.find(params[:id])
    @next_path = chapter_test_practice_path(@chapter, @chapter.practice_rules.first, step: params[:step])
  end

  def index
    if @chapter.practice_rules.empty?
      redirect_to chapter_test_story_path(@chapter)
    else
      redirect_to chapter_test_practice_path(@chapter, @chapter.practice_rules.first, step: params[:step])
    end
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
    if params[:step] == "practice"
      @score.practice_lesson_input.merge(params[:lesson_input])
    else
      @score.review_lesson_input.merge(params[:lesson_input])
    end
  end

  def next_id
    if params[:step] == "practice"
      return nil unless @chapter.rule_position.index(params[:id]).present?
      @chapter.rule_position[@chapter.rule_position.index(params[:id]) + 1]
    else
      return nil unless @score.missed_rules.index(@rule).present?
      @score.missed_rules[@score.missed_rules.index(@rule) + 1]
    end
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
