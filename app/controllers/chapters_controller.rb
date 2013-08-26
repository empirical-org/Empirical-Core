class ChaptersController < BaseChapterController
  def final
    @score.finalize!
    render layout: 'application'
  end
end
