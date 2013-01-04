class CMS::QuestionsController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    Question
  end
end
