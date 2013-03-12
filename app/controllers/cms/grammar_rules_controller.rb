class CMS::GrammarRulesController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::GrammarRule
  end
end
