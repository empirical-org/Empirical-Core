class ReviewsController < BaseChapterController
  def show
  end

  def create
    @score.missed_rules = params[:missed_rules]
    @score.save!

    redirect_to chapter_review_path(@chapter)
  end
end
