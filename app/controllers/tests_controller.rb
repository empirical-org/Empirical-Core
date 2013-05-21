class TestsController < ApplicationController
	def index
		@chapter = Chapter.find(params[:chapter_id])
		@assessment = @chapter.assessment
		if params[:assignment_id]
			@assignment_id = params[:assignment_id]
		else
			@assignment_id = 0
		end
	end

	def score
		#@score = Score.where(:user_id => params[:test][:user_id] && :assignment_id => params[:test][:assignment_id])
		@score = Score.where("user_id = ? AND assignment_id = ?", params[:test][:user_id], params[:test][:assignment_id]).first
		@score.items_missed = params[:test][:items_missed]
		@score.lessons_completed = params[:test][:lessons_completed]
		@score.give_time
		@score.save
		respond_to do |format|
			format.html { redirect_to profile_path, notice: 'Chapter completed.' }
			format.json { render json: @score, status: :created, location: profile_path }
		end
	end
end