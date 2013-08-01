class StoriesController < BaseChapterController
  before_filter :signed_in!

  def show
    @assessment = @chapter.assessment
    @body_class = 'con-skyblue'
  end

  def create
    @score.missed_rules = params[:missed_rules]
    @score.save!

    redirect_to chapter_test_practice_index_path(@chapter, step: "review")
  end
end
