class CMS::HomepageNewsSlidesController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::HomepageNewsSlide
  end
end
