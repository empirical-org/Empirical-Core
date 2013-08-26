class StoriesController < BaseChapterController
  before_filter :signed_in!

  def show
    @assessment = @chapter.assessment
    @body_class = 'con-skyblue'
  end

  def create
    @score.missed_rules = params[:missed_rules]
    @score.save!

    redirect_to chapter_review_index_path(@chapter)
  end
end
