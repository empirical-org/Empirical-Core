class ChaptersController < BaseChapterController
  prepend_before_filter :set_chapter_id

  def show
    redirect_to chapter_practice_index_path(@chapter) if @score.unstarted?
  end

  def final
    @score.finalize!
    render layout: 'application'
  end

  def start
    unless @score.unstarted?
      @score.trash!
      @assignment, @score = Assignment.temporary(@chapter, user: current_user)
    end

    redirect_to chapter_practice_index_path(@chapter)
  end

protected

  def set_chapter_id
    params[:chapter_id] ||= params[:id]
  end
end
