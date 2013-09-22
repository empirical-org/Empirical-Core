class Chapter::StartController < Chapter::BaseController
  prepend_before_filter :set_chapter_id

  def show
    resume if @score.unstarted?
  end

  def final
    @score.finalize!
    @score = ScoreFinalView.find(@score.id)
    @score.context = self
    render layout: 'application'
  end

  def start
    unless @score.unstarted?
      @score.trash!
    end

    redirect_to chapter_practice_index_path(@chapter)
  end

  def resume
    redirect_to @chapter_test.next_page_url
  end

protected

  def set_chapter_id
    params[:chapter_id] ||= params[:id]
  end
end
