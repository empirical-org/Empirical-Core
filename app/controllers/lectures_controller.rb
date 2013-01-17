class LecturesController < ApplicationController
  def show
    redirect_to chapter_path(CMS::Lecture.find(params[:id]).chapter_groups.first.lecture_chapters.first)
  end
end
