class ChaptersController < ApplicationController
  layout 'questions'

  def show
    @lecture_chapter = CMS::LectureChapter.find(params[:id])
  end
end
