class Chapter::StartController < Chapter::BaseController
  prepend_before_filter :set_chapter_id

  def show
    resume and return if @score.unstarted?
    render layout: 'application'
  end

  def final
    @score.finalize!
    @checker = StoryChecker.find(@score.id)
    render layout: 'application'
  end

  def start
    unless @score.unstarted?
      @score.trash!
    end

    redirect_to chapter_practice_index_path(@chapter)
  end

  def retry
    @score = ClassroomChapter.create_score(@chapter, user: @user)
    redirect_to @chapter_test.next_page_url
  end

  def resume
    redirect_to @chapter_test.next_page_url
  end

protected

  def set_chapter_id
    params[:chapter_id] ||= params[:id]
  end
end
