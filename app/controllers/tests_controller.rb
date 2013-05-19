class TestsController < ApplicationController
	def index
		@chapter = Chapter.find(params[:chapter_id])
		@assessment = @chapter.assessment
	end
end