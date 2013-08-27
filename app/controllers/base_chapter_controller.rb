class BaseChapterController < ApplicationController
  before_filter :find_assignment

  def find_assignment
    @body_class = 'con-skyblue'
    @chapter = Chapter.find(params[:chapter_id])


    if current_user.present? && @assignment = current_user.student_assignments.for_chapter(@chapter)
      @score = current_user.scores.find_by_assignment_id!(@assignment.id)
      # raise @score.state unless params[:action] == 'start'
    else
      @assignment, @score = Assignment.temporary(@chapter, user: current_user)
    end

    @chapter_test = ChapterTest.new(self)
  end
end
