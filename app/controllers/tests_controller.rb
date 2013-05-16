class TestsController < ApplicationController
	def index
		@chapter = Chapter.find(3)
		@assessment = @chapter.assessment
		@rules = @chapter.rules
		@lessons = @chapter.lessons
	end
end