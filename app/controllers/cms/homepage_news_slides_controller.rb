class CMS::HomepageNewsSlidesController < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::HomepageNewsSlide
  end

  def homepage_news_slide_params
    params.require(:homepage_news_slide).permit(:image, :link, :position, :text)
  end
  alias :subject_params :homepage_news_slide_params
end
