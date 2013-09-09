class StoriesController < BaseChapterController
  def show
    @assessment = @chapter.assessment
    @body_class = 'con-skyblue'
  end

  def create
    @score.missed_rules = params[:missed_rules]
    @score.save!
    @score.review!

    redirect_to @chapter_test.next_page_url
  end
end
