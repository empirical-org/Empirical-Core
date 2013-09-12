class StoriesController < BaseChapterController
  def show
    @assessment = @chapter.assessment
    @body_class = 'con-skyblue'
  end

  def create
    @checker = StoryChecker.find(@score.id)
    @checker.context = self
    @checker.check_input!(params.delete(:_json))
    @score.reload.review!

    # redirect_to @chapter_test.next_page_url
    render layout: false
  end
end
