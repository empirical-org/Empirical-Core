class TestsController < ApplicationController
	before_filter :signed_in!
	before_filter :find_assignment

  def show
    @chapter = @assignment.chapter
    @assessment = @chapter.assessment
    @user = current_user
    render :index
  end

  def practice

  end

  def score
    @score = Score.where("user_id = ? AND assignment_id = ?", params[:test][:user_id], params[:test][:assignment_id]).first
    @score.items_missed = params[:test][:items_missed]
    @score.lessons_completed = params[:test][:lessons_completed]
    @score.give_time
    @score.save
    redirect_to profile_path, notice: 'Chapter completed.'
  end

  protected

  def find_assignment
    @assignment = Assignment.find(params[:assignment_id])
  end
end
