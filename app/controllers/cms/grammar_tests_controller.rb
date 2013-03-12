class CMS::GrammarTestsController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::GrammarTest
  end
end
