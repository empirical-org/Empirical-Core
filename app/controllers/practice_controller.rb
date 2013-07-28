class PracticeController < ApplicationController
  before_filter :signed_in!
  before_filter :find_assignment

  def show
    @rule = Rule.find(params[:id])
    @next_path = assignment_test_practice_path(@assignment, @assignment.chapter.practice_rules.first)
  end

  def index
    redirect_to assignment_test_practice_path(@assignment, @assignment.chapter.practice_rules.first)
  end

  def update
    @rule = Rule.find(params[:id])
    @score.lesson_input = @score.lesson_input.merge(params[:lesson_input])
    @score.save!

    redirect_to next_lesson
  end

  protected

  def next_lesson
    next_id = @assignment.chapter.rule_position[@assignment.chapter.rule_position.index(params[:id]).to_i + 1]

    if next_id.present?
      assignment_test_practice_path @assignment, next_id
    else
      story_assignment_test_path(@assignment)
    end
  end

  def find_assignment
    @assignment = Assignment.find(params[:assignment_id])
    @score = current_user.scores.find_by_assignment_id!(@assignment.id)
  end
end
