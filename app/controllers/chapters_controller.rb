class ChaptersController < ApplicationController
  def show
    @lecture_chapter = CMS::LectureChapter.find(params[:id])
  end
end
