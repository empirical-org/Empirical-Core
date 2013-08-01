class BaseChapterController < ApplicationController
  before_filter :find_assignment

  def find_assignment
    @chapter = Chapter.find(params[:chapter_id])

    if current_user.present?
      @assignment = current_user.student_assignments.for_chapter(@chapter)
      @score = current_user.scores.find_by_assignment_id!(@assignment.id)
    else
      @assignment = Assignment.temporary(@chapter)
      @score = @assignment.scores.create!
    end
  end
end