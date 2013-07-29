class TestsController < ApplicationController
	before_filter :signed_in!
	before_filter :find_assignment

  def show
    @chapter = @assignment.chapter
    @assessment = @chapter.assessment
    @user = current_user
    render :index
  end

  def story
    @chapter = @assignment.chapter
    @assessment = @chapter.assessment
    render 'application/_chapter_test'
  end

  def final
    @score.finalize!
  end

  protected

  def find_assignment
    @assignment = Assignment.find(params[:assignment_id])
    @score = current_user.scores.find_by_assignment_id!(@assignment.id)
  end
end
