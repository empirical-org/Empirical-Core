class LecturesController < ApplicationController
  def show
    redirect_to chapter_path(CMS::Lecture.find(params[:id]).lecture_chapters.first)
  end
end
