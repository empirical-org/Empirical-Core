class StoriesController < ApplicationController
  before_filter :signed_in!
  before_filter :find_assignment

  def show
    @chapter = @assignment.chapter
    @assessment = @chapter.assessment
    render 'application/_chapter_test'
  end

  def create
    @score.missed_rules = params[:missed_rules]
    @score.save!

    redirect_to assignment_test_practice_index_path(@assignment, step: "review")
  end

  protected

  def find_assignment
    @assignment = Assignment.find(params[:assignment_id])
    @score = current_user.scores.find_by_assignment_id!(@assignment.id)
  end
end
