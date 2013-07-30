class PracticeController < ApplicationController
  before_filter :signed_in!
  before_filter :find_assignment

  def show
    @rule = Rule.find(params[:id])
    @next_path = assignment_test_practice_path(@assignment, @assignment.chapter.practice_rules.first, step: params[:step])
  end

  def index
    if @assignment.chapter.practice_rules.empty?
      redirect_to assignment_test_story_path(@assignment)
    else
      redirect_to assignment_test_practice_path(@assignment, @assignment.chapter.practice_rules.first, step: params[:step])
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
      return nil unless @assignment.chapter.rule_position.index(params[:id]).present?
      @assignment.chapter.rule_position[@assignment.chapter.rule_position.index(params[:id]) + 1]
    else
      return nil unless @score.missed_rules.index(@rule).present?
      @score.missed_rules[@score.missed_rules.index(@rule) + 1]
    end
  end

  def next_lesson
    if next_id.present?
      assignment_test_practice_path @assignment, next_id, step: params[:step]
    else
      step_after_rules_completed
    end
  end

  def step_after_rules_completed
    if params[:step] == "practice"
      assignment_test_story_path(@assignment)
    else
      @score.finalize!
      final_assignment_test_path(@assignment)
    end
  end

  def find_assignment
    @assignment = Assignment.find(params[:assignment_id])
    @score = current_user.scores.find_by_assignment_id!(@assignment.id)
  end
end
