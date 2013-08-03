class TestsController < BaseChapterController
	before_filter :signed_in!

  def index
    redirect_to chapter_test_practice_index_path(@chapter, step: "practice")
  end

  def show
    @chapter = @assignment.chapter
    @assessment = @chapter.assessment
    @user = current_user
    render :index
  end

  def story
    @chapter = @assignment.chapter
    @assessment = @chapter.assessment
    render 'application/_chapter_test'
  end

  def final
    @score.finalize!
  end
end
