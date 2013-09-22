class Chapter::BaseController < ApplicationController
  before_filter :find_assignment, except: ['verify', 'verify_status']
  layout 'chapter_test'

  def find_assignment
    @body_class = 'con-skyblue'
    @chapter = Chapter.find(params[:chapter_id])
    @user = if current_user.present? then current_user else temporary_user end

    if @classroom_chapter = @user.assigned_classroom_chapters.for_chapter(@chapter)
      @score = @user.scores.find_by_classroom_chapter_id!(@classroom_chapter.id)
    else
      @classroom_chapter, @score = ClassroomChapter.temporary(@chapter, user: @user)
    end

    @chapter_test = ChapterTest.new(self)
  end

private

  def temporary_user
    unless user = User.unscoped.find_by_id(session[:temporary_user_id])
      user = User.create! role: 'temporary'
      session[:temporary_user_id] = user.id
    end

    user
  end
end
